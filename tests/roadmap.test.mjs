import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {plannedModules} from '../roadmap.js';

test('roadmap includes twelve distinct future modules with no fake links',()=>{
 assert.equal(plannedModules.length,12);
 assert.equal(new Set(plannedModules.map(m=>m.id)).size,12);
 for(const item of plannedModules){
  assert.match(item.name,/^WarLike /);
  assert.match(item.priority,/^P[012]$/);
  assert.equal(item.status,'planned');
  assert.ok(item.description.length>=25);
  assert.equal(Object.hasOwn(item,'url'),false);
 }
});
test('roadmap is separate from live Hub catalog and attached to HTML',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/id="warlike-roadmap"/);
 assert.match(html,/data-roadmap-list/);
 assert.match(html,/src="\.\/roadmap\.js"/);
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 assert.ok(!app.includes('qa-lab'));
});
