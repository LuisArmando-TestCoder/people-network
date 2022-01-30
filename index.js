const {config} = require('dotenv')
const puppeteer = require('puppeteer');

config()

const getMutualFollowers = async (page, username) => {
    await page.goto(`https://www.instagram.com/${username}`, { waitUntil: "networkidle2" });
    // await page.click('a[href="/rmbhh/"]');
    await page.waitFor(2000);
    const followersBtn = await page.$('div[id=react-root] > section > main > div > header > section > ul > li:nth-child(2) > a');
    await followersBtn.evaluate(btn => btn.click());

    await page.waitFor(3000);
    const followersDialog = 'body > div > div > div > div + div';
    await scrollDown(followersDialog, page);
	await page.waitFor(3000);
	
    console.log("getting followers");
    const list1 = await page.$$('body > div > div > div > div > ul > div > li > div > div > div > div > span > a');
    const followers = await Promise.all(list1.map(async item => {
        const username = await (await item.getProperty('innerText')).jsonValue();

        return username
    }));

    const closeBtn = await page.$('body > div > div > div > div:nth-child(1) > div > div:nth-child(3) > button');
    await closeBtn.evaluate(btn => btn.click());

    const followingBtn = await page.$('div[id=react-root] > section > main > div > header > section > ul > li:nth-child(3) > a');
    await followingBtn.evaluate(btn => btn.click());
    
    await page.waitFor(3000);
    const followingDialog = 'body > div > div > div > div + div + div';
    await scrollDown(followingDialog, page);
	await page.waitFor(3000);

    console.log("getting following");
    const list2 = await page.$$('div > div > span > a');
    const following = await Promise.all(list2.map(async item => {
        const username = await (await item.getProperty('innerText')).jsonValue()
        return username;
    }));

    const mutualFollowers = following.filter(item => followers.includes(item));

	console.log(mutualFollowers)

	return mutualFollowers
};

async function scrollDown(selector, page) {
    await page.evaluate(async selector => {
        const section = document.querySelector(selector);
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            const timer = setInterval(() => {
                var scrollHeight = section.scrollHeight;
                section.scrollTop = 100000000;
                totalHeight += distance;

                if (totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    }, selector);
}



(async () => {
    const browser = await puppeteer.launch({ 
        args: [
            '--incognito',
        ],
        headless: false 
    });
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
    await page.type('input[name=username]', process.env.IG_USERNAME, { delay: 20 });
    await page.type('input[name=password]', process.env.IG_PASSWORD, { delay: 20 });
    await page.click('button[type=submit]', { delay: 20 });
    await page.waitFor(5000)

    const notifyBtns = await page.$x("//button[contains(text(), 'Not Now')]");
    if (notifyBtns.length > 0) {
        await notifyBtns[0].click();
    } else {
        console.log("No notification buttons to click.");
    }

    const mutualFollowers = await getMutualFollowers(page, "latestcoder")

    for (const mutualFollower of mutualFollowers) {
        await getMutualFollowers(page, mutualFollower)
    }
    await browser.close();
})()