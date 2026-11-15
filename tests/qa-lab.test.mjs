import test from 'node:test';
import assert from 'node:assert/strict';
import {PROJECTS,projectEndpoint,summarizeRuns} from '../qa-core.js';
import {readFileSync} from 'node:fs';
test('allowlist includes critical projects; no arbitrary GitHub URLs',()=>{
 assert.ok(PROJECTS.includes('WarLike-Engine')&&PROJECTS.includes('WarLike-Studio'));
 assert.equal(new Set(PROJECTS).size,PROJECTS.length);
 assert.match(projectEndpoint('WarLike-Engine'),/^https:\/\/api.github.com\/repos\/Motherlode94\/WarLike-Engine\/actions\/runs/);
 assert.throws(()=>projectEndpoint('../secrets'),TypeError);
});
const run=(name,conclusion,status='completed',event='push',sha='abc123456789')=>({name,status,conclusion,event,head_sha:sha,html_url:'https://github.com/Motherlode94/WarLike-Engine/actions/runs/123',created_at:new Date().toISOString()});
test('latest run per workflow has precedence and failure is visible',()=>{
 const s=summarizeRuns({workflow_runs:[run('Build','failure'),run('Build','success'),run('Test','success')]});
 assert.equal(s.state,'failure');assert.equal(s.workflows.length,2);
 assert.equal(s.workflows[0].state,'failure');
});
test('unknown and rate-limited state must never appear as passing',()=>{
 assert.equal(summarizeRuns({workflow_runs:[]}).state,'unknown');
 assert.equal(summarizeRuns({workflow_runs:[run('Review','neutral')]}).state,'unknown');
 assert.equal(summarizeRuns({workflow_runs:[run('Build',null,'in_progress')]}).state,'running');
 assert.equal(summarizeRuns({workflow_runs:[run('Build','success','completed','pull_request')]}).state,'unknown');
 assert.throws(()=>summarizeRuns({message:'API rate limit exceeded'}),TypeError);
});
test('cross-repository links from untrusted payloads are discarded',()=>{
 const s=summarizeRuns({workflow_runs:[{...run('Test','success'),html_url:'https://evil.example/test'}]});
 assert.equal(s.workflows[0].url,null);
});
test('QA dashboard is a real local entry point and Hub links to it',()=>{
 const html=readFileSync(new URL('../qa-lab.html',import.meta.url),'utf8');
 const roadmap=readFileSync(new URL('../roadmap.js',import.meta.url),'utf8');
 assert.match(html,/id="projects"/);assert.match(html,/qa-lab\.js/);
 assert.match(roadmap,/\.\/qa-lab\.html/);
 assert.doesNotMatch(html,/token|password|api_key/i);
});
