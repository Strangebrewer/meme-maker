import cheerio from 'cheerio';
import minify from 'html-minifier';
import slugify from 'slugify';
import ContentSchema from '../schemas/ContentSchema';
import AwsStore from '../modules/aws/Store';
import BaseModel from './BaseModel';

export default class Content extends BaseModel {
	constructor() {
		super(ContentSchema);
	}

	async render(slug) {
		return await this.Schema.findOne({ slug });
	}

	async buildHtml(template) {
		const $ = cheerio.load('', {
			normalizeWhitespace: false,
			xmlMode: false
		});

		const $head = $('head');		
		$head.append(`
			<meta charset="utf-8" />
			<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
			<meta name="viewport" content="width=1920" />
		`);
		
		const $body = $('body');
		$body.css({ margin: '0', padding: '0' });

		$body.append(`<canvas id="canvas-${template._id}"></canvas>`);

		// $body.append('<div class="wrapper"></div>');

		// const $wrapper = $('.wrapper');
		// $wrapper.css({
		// 	width: `${template.width}px`,
		// 	height: `${template.height}px`,
		// 	'background-color': template.backgroundColor,
		// 	position: 'relative',
		// 	margin: '0',
		// 	padding: '0'
		// });

		// for (let i = 0; i < template.objects.length; i++) {
		// 	const element = template.objects[i];
		// 	const svg = Buffer.from(element.svg, 'base64').toString();

		// 	$wrapper.append(`<svg class="svg-${i}" width="100%" height="100%">${svg}</svg>`);
		// 	$(`.svg-${i}`).css({
		// 		position: 'absolute',
		// 		top: '0',
		// 		left: '0',
		// 	});
		// }

		const { organization, _id } = template;

		$body.append(`<script src="${AwsStore.getAssetPath('fabric.min.js')}" type="text/javascript"></script>`);
		$body.append(`<script src="${AwsStore.getAssetPath('dateFunctions.js')}" type="text/javascript"></script>`);
		$body.append(`<script src="${AwsStore.getAssetPath('test.js')}" type="text/javascript"></script>`);

		let html = $.html();
		html = minify.minify(html, {
			minifyCSS: true,
			collapseInlineTagWhitespace: false,
			collapseWhitespace: false,
			minifyJS: true
		});

		// return unescape(encodeURIComponent(html));
		return html;
	}

	async updateContent(_id, data, options) {
        options = { ...options, new: true };
		if (data.name) data.slug = slugify(data.name, { lower: true });
		
		const html = this.buildHtml(data);		
		await AwsStore.put(data.organization, _id, html, { content_type: 'text/html' });

		data.url = AwsStore.getItemUrl(data.organization, _id);		
		return await this.Schema.findOneAndUpdate({ _id }, data, options);
	}
}