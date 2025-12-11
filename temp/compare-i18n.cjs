const en = require('../src/i18n/locales/en.json');
const vi = require('../src/i18n/locales/vi.json');

function getAllKeys(obj, prefix) {
	prefix = prefix || '';
	let keys = [];
	for (const key in obj) {
		const fullKey = prefix ? prefix + '.' + key : key;
		if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
			keys = keys.concat(getAllKeys(obj[key], fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys;
}

const enKeys = new Set(getAllKeys(en));
const viKeys = new Set(getAllKeys(vi));

const inEnNotVi = [...enKeys]
	.filter(function (k) {
		return !viKeys.has(k);
	})
	.sort();
const inViNotEn = [...viKeys]
	.filter(function (k) {
		return !enKeys.has(k);
	})
	.sort();

console.log('=== Keys in EN but NOT in VI ===');
inEnNotVi.forEach(function (k) {
	console.log(k);
});

console.log('');
console.log('=== Keys in VI but NOT in EN ===');
inViNotEn.forEach(function (k) {
	console.log(k);
});

console.log('');
console.log('=== Summary ===');
console.log('EN-only keys:', inEnNotVi.length);
console.log('VI-only keys:', inViNotEn.length);
