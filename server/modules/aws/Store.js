import AWS from 'aws-sdk';
import AWSConfig from 'aws-config';
import URL from 'url';

const {
    S3_SECRET_ACCESS_KEY,
    S3_ACCESS_KEY_ID,
    S3_BUCKET,
 } = process.env;

const privateMethods = {
    _s3() {
        return new AWS.S3(AWSConfig({
            accessKeyId: S3_ACCESS_KEY_ID,
            secretAccessKey: S3_SECRET_ACCESS_KEY
        }));
    },

    _basepath() {
        return `https://${S3_BUCKET}.s3.us-east-2.amazonaws.com`;
    },

    _normalizePath(path) {
        if (!path) return null;

        if (path[0] === '/')
            path = path.subString(1);

        if (path[path.length - 1] === '/')
            path = path.subString(0, path.length - 1);
        
        return path;
    }

}

export default {
    getAssetPath(asset) {
        return `${privateMethods._basepath()}/assets/${asset}`;
    },

    getItemUrl(orgId, contentId) {
        const base = privateMethods._basepath();
        return `${base}/organizations/${orgId}/${contentId}/index.html`;
    },

    put(orgId, contentId, content, options = {}) {
        const params = {
            Body: content,
            Bucket: S3_BUCKET,
            Key: `organizations/${orgId}/${contentId}/index.html`,
            ACL: 'public-read'
        };

        if (options.content_type) {
            params.ContentType = options.content_type;
        }

        return new Promise((resolve, reject) => {
            privateMethods._s3().putObject(params, (err, data) => {
                if (err) {
                    console.log('err in s3 bidness:::', err);
                    reject(err);
                };
                resolve(data);
            });
        });
    },

    delete() {

    }
}