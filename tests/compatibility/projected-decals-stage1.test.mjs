import assert from 'node:assert/strict';

const fixture = [
    'be=!!(me&&me.length>0),we=pe||be,ke=!pe||y<2,Ce=!!w.forceUVSet1,',
    'Se={s:0,v:0};',
    'pe&&!ke&&(Fe=Math.pow(2,null!==(Me=ve.s)&&void 0!==Me?Me:Re)*Ee,',
    'Be=Math.pow(2,null!==(Te=ve.sy)&&void 0!==Te?Te:Re),',
    'De=Math.pow(2,null!==(je=ve.sz)&&void 0!==je?je:Re));',
].join('');

const patches = [
    {
        id: 'decals.renderer.force-projected',
        search: 'be=!!(me&&me.length>0),we=pe||be,ke=!pe||y<2,Ce=!!w.forceUVSet1',
        replacement: 'be=!!(me&&me.length>0),we=pe||be,ke=void 0===ve.forceProjectedScript?!pe||y<2:!ve.forceProjectedScript,Ce=!!w.forceUVSet1',
        postcondition: 'ke=void 0===ve.forceProjectedScript?!pe||y<2:!ve.forceProjectedScript',
    },
    {
        id: 'decals.renderer.unequal-scale',
        search: 'pe&&!ke&&(Fe=Math.pow(2,null!==(Me=ve.s)&&void 0!==Me?Me:Re)*Ee',
        replacement: 'pe&&(!ke||ve.enableUnequalScaling)&&(Fe=Math.pow(2,null!==(Me=ve.s)&&void 0!==Me?Me:Re)*Ee',
        postcondition: 'pe&&(!ke||ve.enableUnequalScaling)&&(Fe=Math.pow(2',
    },
];

function countExact(source, needle) {
    let count = 0;
    let index = 0;
    while (index <= source.length) {
        const found = source.indexOf(needle, index);
        if (found === -1) break;
        count += 1;
        index = found + Math.max(1, needle.length);
    }
    return count;
}

let transformed = fixture;
for (const patch of patches) {
    assert.equal(
        countExact(transformed, patch.search),
        1,
        `${patch.id} must match exactly once`,
    );
    transformed = transformed.replace(patch.search, patch.replacement);
    assert.equal(
        countExact(transformed, patch.postcondition),
        1,
        `${patch.id} postcondition must occur exactly once`,
    );
}

assert.doesNotThrow(() => new Function(transformed));
assert.equal(countExact(transformed, 've.forceProjectedScript'), 2);
assert.equal(countExact(transformed, 've.enableUnequalScaling'), 1);

console.log('projected-decals-stage1 fixture test: PASS');
