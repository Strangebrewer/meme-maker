import AWS from 'aws-sdk';
import AWSConfig from 'aws-config';

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

    getItemJsonUrl(orgId, contentId) {
        const base = privateMethods._basepath();
        return `${base}/organizations/${orgId}/${contentId}/canvas.json`;
    },

    putItemJson(orgId, contentId, content) {
        const params = {
            Body: content,
            Bucket: S3_BUCKET,
            Key: `organizations/${orgId}/${contentId}/canvas.json`,
            ACL: 'public-read'
        };

        return new Promise((resolve, reject) => {
            privateMethods._s3().putObject(params, (err, data) => {
                if (err) {
                    console.log('err in s3 putItemJson bidness:::', err);
                    reject(err);
                };
                resolve(data);
            });
        });
    },

    downloadJson(orgId, contentId) {
        const params = {
            Bucket: S3_BUCKET,
            Key: `organizations/${orgId}/${contentId}/canvas.json`
        };

        return new Promise((resolve, reject) => {
            privateMethods._s3().getObject(params, (err, data) => {
                if (err) {
                    console.log('err in s3 downloadThisFuckingCrap:::', err);
                    reject(err);
                };
                resolve(data);
            });
        });
    },

    put(orgId, contentId, content, fileName, options = {}) {
        const params = {
            Body: content,
            Bucket: S3_BUCKET,
            Key: `organizations/${orgId}/${contentId}/${fileName}`,
            ACL: 'public-read',
            ...options
        };

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