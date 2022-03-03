import cheerio from 'cheerio';
import minify from 'html-minifier';
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

		const { organization, _id } = template;
		const rawData = await AwsStore.downloadJson(organization, _id);
		let json = Buffer.from(rawData.Body, 'utf-8').toString();

		// this (below) works just as well, but storing it on and downloading it from AWS (above)
		// 	makes the file smaller. I don't know what they does, but whatever they does shrinks
		//  the file size significantly - as much as 50% in some cases
		// json = JSON.stringify(template);

		$body.append(`<script src="${AwsStore.getAssetPath('fabric.min.js')}" type="text/javascript"></script>`);
		$body.append(`<script src="${AwsStore.getAssetPath('addFabricObjects.js')}" type="text/javascript"></script>`);
		$body.append(`<script src="${AwsStore.getAssetPath('dateFunctions.js')}" type="text/javascript"></script>`);
		$body.append(`<script id="canvas-json" type="application/json">${json}</script>`);
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
		console.log('data:::', data);
		options = { ...options, new: true };

		const canvasData = {
			_id: data._id,
			organization: data.organization,
			backgroundColor: data.backgroundColor,
			backgroundImage: data.backgroundImage,
			height: data.height,
			width: data.width,
			objects: data.objects,
		};

		const stringified = JSON.stringify(canvasData);
		await AwsStore.put(data.organization, _id, stringified, 'canvas.json', { ContentType: 'application/json' });

		const html = await this.buildHtml(data);
		await AwsStore.put(data.organization, _id, html, 'index.html', { ContentType: 'text/html' });

		data.url = AwsStore.getItemUrl(data.organization, _id);
		let found = await this.Schema.findById(_id);
		Object.assign(found, data);
		return await found.save();
	}
}