import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = p => readFileSync(new URL('../'+p, import.meta.url), 'utf8');
const scope={exports:{}};
vm.runInNewContext(ts.transpileModule(read('src/data/classes.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,scope);
const plans=scope.exports.SATORIN_PLANS;
assert.deepEqual(Array.from(plans,p=>p.price),['6,000','4,000','10,000','7,000','10,000']);
assert.equal(plans.length,5);
assert.deepEqual(Array.from(plans,p=>p.community),[false,false,false,false,true]);
assert.deepEqual(Array.from(plans,p=>p.inperson),[false,false,false,true,true]);
assert.equal(scope.exports.OSAKA_PLANS.length,2);
const html=read('public/satorin/index.html');
for(const p of plans){assert.ok(html.includes(p.name));assert.ok(html.includes(p.price));for(const f of p.features)assert.ok(html.includes(f));}
for(const old of ['月平均20回','月20回','月8回','月4回','21,000','36,000','300</span>','750</span>'])assert.ok(!html.includes(old),old);
assert.equal((html.match(/class="plan-card"/g)||[]).length,5);
assert.ok(html.includes('月・水・金｜6:00〜6:45（祝日休み）'));
console.log('PASS: membership prices, frequencies, entitlements, static copy and card count');
