let PATH = null;
let load = null;

if (typeof fetch !== 'undefined') {
	PATH = '/components';
	load = async path => (await fetch(path)).text();
} else {
	PATH = './public/components';
	const fs = (await import('fs')).promises;
	load = async path => await fs.readFile(path);
}

function compile(html, stylePath) {
	return `
        <div>
            <link rel="stylesheet" href="${stylePath}" />
            ${html}
        </div>
    `;
}

export default async function (component) {
	const path = `${PATH}/${component}`;
	const html = await load(`${path}/template.html`);
	const stylePath = `/components/${component}/style.css`;

	return compile(html, stylePath);
}
