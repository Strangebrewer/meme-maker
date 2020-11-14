import ContentSchema from '../schemas/ContentSchema';
import Render from '../models/RenderModel';
import BaseModel from './BaseModel';
import cheerio from 'cheerio';
import minify from 'html-minifier';
import slugify from 'slugify';

export default class Content extends BaseModel {
	constructor() {
		super(ContentSchema);
	}

	async render(slug) {
		const renderModel = new Render();
		return await renderModel.findOne({ slug });
	}

	buildRender(template) {
		const $ = cheerio.load('<html><head></head><body><div class="wrapper"></div></body></html>', {
			normalizeWhitespace: false,
			xmlMode: true
		});

		const $wrapper = $('.wrapper');
		$wrapper.css({
			width: `${template.width}px`,
			height: `${template.height}px`,
			'background-color': template.backgroundColor,
			position: 'relative',
			margin: '0',
			padding: '0'
		});

		for (let i = 0; i < template.objects.length; i++) {
			const element = template.objects[i];
			const svg = Buffer.from(element.svg, 'base64').toString();

			$wrapper.append(`<svg class="svg-${i}" width="100%" height="100%">${svg}</svg>`);
			$(`.svg-${i}`).css({
				position: 'absolute',
				top: '0',
				left: '0',
			});
		}

		const $body = $('body');
		$body.css({ margin: '0', padding: '0' });

		let html = $.html();
		html = minify.minify(html, {
			minifyCSS: true,
			collapseInlineTagWhitespace: false,
			collapseWhitespace: false,
			minifyJS: true
		});

		return unescape(encodeURIComponent(html));
	}

	async updateContent(_id, data, options) {
		console.log('is it doing the thing???')
        options = { ...options, new: true };
		if (data.name) data.slug = slugify(data.name, { lower: true });
		
		let updated = await this.Schema.findOneAndUpdate({ _id }, data, options);
		console.log('updated:::', updated)
		const encodedHtml = this.buildRender(updated.toObject());

		const renderModel = new Render();

		let rendered = await renderModel.findOne({ slug: updated.slug });

		const renderUpdate = {
			html: encodedHtml,
			content: updated._id,
			name: updated.name
		}

		if (rendered) renderUpdate._id = rendered._id;


		const saved = await renderModel.save(renderUpdate);

		if (!rendered)
			updated = await this.Schema.findOneAndUpdate({ _id }, { render: saved._id });

		return updated;
	}
}