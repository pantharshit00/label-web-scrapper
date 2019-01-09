const puppeteer = require('puppeteer')
const issueData = require('./data.json')
const fs = require('fs')

;(async () => {
  const data = [];
  const browser = await puppeteer.launch({
    args:["--no-sandbox"]
  });
  let p = 1;
  for (const issue of issueData) {
    if(p % 5 == 0 ) console.log(p, 'done');
    const page = await browser.newPage()
    await page.goto(`https://github.com/prisma/prisma/issues/${issue}`, {
      waitUntil: 'domcontentloaded',
    })
    const elements = await page.$$('.IssueLabel > .lh-condensed-ultra')
    const x = elements.map(element => {
      return page.evaluate(element => element.innerText, element)
    })
    const labels = await Promise.all(x);
    data.push({number: issue, labels})
    await page.close();
    p++;
    if(p % 20 == 0)
      fs.writeFileSync('./labels.json', data);
  }
  console.log(JSON.stringify(data));
  fs.writeFileSync('./labels.json',data);
})()
