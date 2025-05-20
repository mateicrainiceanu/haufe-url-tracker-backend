import Redirect from "../models/Redirect";
import randomstring from "randomstring";
import Tracker from "../models/Tracker";
import logger from "../config/logger";

export default class RedirectService {

    static generateKeyword() {
        const kw = randomstring.generate(10);
        logger.trace(`RedirectService.gerenateKeyword [${kw}]`);
        return kw;
    }

    static async createSimpleRedirect(dest: string) {
        logger.trace(`RedirectService.createSimpleRedirect [${dest}]`);
        return Redirect.create({url: dest, keyword: this.generateKeyword()});
    }

    static async createKeywordRedirect(dest: string, keyword: string) {
        logger.trace(`RedirectService.createKeywordRedirect [${dest}]`);
        return Redirect.create({url: dest, keyword});
    }

    static getRedirectByKeyword(keyword: string) {
        logger.trace(`RedirectService.getRedirectByKeyword [${keyword}]`);
        return Redirect.findOne({
            where: {keyword}, include: [{
                model: Tracker,
                as: 'tracker',
            }]
        });
    }

    static deleteRedirect(redirect: Redirect) {
        logger.trace(`RedirectService.deleteRedirect [${redirect.id}]`);
        return redirect.destroy();
    }

    static createRedirect(url: string, kw?: string) {
        logger.trace(`RedirectService.createRedirect [${url}] [${kw}]`);
        if (kw) {
            return this.createKeywordRedirect(url, kw);
        } else {
            return this.createSimpleRedirect(url);
        }

    }
}