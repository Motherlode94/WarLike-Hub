import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelectorAll('.card').length>0);
 const count=await page.locator('.card').count();
 assert.ok(count>=11,'Hub must list the integrated services');
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
