import test from 'node:test';
import assert from 'node:assert';
import katex from 'katex';

test('KaTeX Mathematical Formula Rendering Suite', async (t) => {
  await t.test('Fractions rendering', () => {
    const html = katex.renderToString('\\frac{2x}{1 + x^2}', { throwOnError: true });
    assert.ok(html.includes('frac-line'), 'Should render fraction line');
  });

  await t.test('Integrals rendering', () => {
    const html = katex.renderToString('\\int x \\sin x \\, dx = -x \\cos x + \\sin x + C', { throwOnError: true });
    assert.ok(html.includes('int'), 'Should render integral symbol');
  });

  await t.test('Matrices rendering', () => {
    const html = katex.renderToString('\\begin{bmatrix} a & b \\\\ -b & a \\end{bmatrix}', { throwOnError: true });
    assert.ok(html.includes('matrix') || html.includes('table'), 'Should render matrix structure');
  });

  await t.test('Limits rendering', () => {
    const html = katex.renderToString('\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', { throwOnError: true });
    assert.ok(html.includes('lim'), 'Should render limit operator');
  });

  await t.test('Derivatives and rates of change rendering', () => {
    const html = katex.renderToString('\\frac{dA}{dr} = \\frac{d}{dr}(\\pi r^2) = 2\\pi r', { throwOnError: true });
    assert.ok(html.includes('frac'), 'Should render derivative fraction');
  });

  await t.test('Aligned multiline environments rendering', () => {
    const html = katex.renderToString('\\begin{aligned} a_{13} &= 19 \\\\ a_{21} &= 35 \\end{aligned}', { throwOnError: true });
    assert.ok(html.length > 50, 'Should render aligned multiline equations');
  });
});
