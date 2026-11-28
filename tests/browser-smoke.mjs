import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelectorAll('.card').length>0);
 const count=await page.locator('.card').count();
 assert.equal(count,43,'Hub must list the complete audited catalog');
 for(const [name,url] of [["WarLike Heart","https://warlike-heart.pages.dev/"],["WarLike Rig Studio","https://warlike-rig-studio.pages.dev/"],["WarLike Ebook","https://warlike-ebook.pages.dev/"],["WarLike Academy","https://warlike-academy.pages.dev/"],["WarLike Business","https://warlike-business.pages.dev/"],["WarLike Records","https://warlike-records.pages.dev/"],["WarLike HelianA","https://warlike-heliana.pages.dev/"],["WarLike Tower","https://warlike-tower.pages.dev/"],["WarLike Networks","https://warlike-networks.pages.dev/"],["WarLike Telecom","https://warlike-telecom.pages.dev/"],["WarLike Control Center","https://warlike-control-center.pages.dev/"],["WarLike MCP","https://warlike-mcp.pages.dev/"],["WarLike Online","https://warlike-online.pages.dev/"],["WarLike Virtual Idols","https://github.com/Motherlode94/WarLike-Virtual-Idols"],["WarLike Music Industry Center","https://github.com/Motherlode94/WarLike-Music-Industry-Center"],["WarLike Bible","https://github.com/Motherlode94/WarLike-Bible-"],["WarLike Themes","https://github.com/Motherlode94/WarLike-Themes"],["WarLike Hub","https://warlike-hub.pages.dev/"],["WarLike Visual Code","https://w-visual-code.pages.dev/"],["WarScripts","https://warscripts.pages.dev/"],["WarWebAssembly","https://warwebassembly.pages.dev/"]]){const heading=page.getByRole('heading',{name,exact:true});assert.equal(await heading.count(),1,name);assert.equal(await heading.locator('..').locator('.cardFoot a').getAttribute('href'),url,name)}
 assert.equal(await page.getByRole('heading',{name:'WarLike Academy',exact:true}).count(),1);
 assert.equal(await page.getByRole('heading',{name:'WarLike Business',exact:true}).count(),1);
 const pdf=page.getByRole('heading',{name:'WarLike PDF'}).locator('..').locator('.cardFoot a');
 assert.equal(await pdf.getAttribute('href'),'https://warlike-pdf.pages.dev/');
 const vault=page.getByRole('heading',{name:'WarLike Crypte'}).locator('..').locator('.cardFoot a');
 assert.equal(await vault.getAttribute('href'),'https://warlike-crypte.pages.dev/');
 await page.locator('#search').fill('recherche-qa-inexistante');
 assert.equal(await page.locator('.card').count(),0);
 await page.locator('#search').fill('');
 await page.waitForFunction(()=>document.querySelectorAll('.card').length>0);
 await page.locator('.card .fav').first().click();
 await page.getByRole('button',{name:/Mes favoris/}).click();
 assert.equal(await page.locator('.card').count(),1);
 assert.deepEqual(errors,[]);
 console.log('PASS: Hub catalogue, independent service links, search, favorites');
}finally{await browser.close()}
