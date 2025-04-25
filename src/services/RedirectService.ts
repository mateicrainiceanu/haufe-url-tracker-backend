import Redirect from "../models/Redirect";
import randomstring from "randomstring";
import Tracker from "../models/Tracker";

export default class RedirectService {

    static generateKeyword() {
        return randomstring.generate(10);
    }

    static async createSimpleRedirect(dest: string) {
        return Redirect.create({ url: dest, keyword: this.generateKeyword() });
    }

    static async createKeywordRedirect(dest: string, keyword: string) {
        return Redirect.create({ url: dest, keyword });
    }

    static deleteRedirect(redirect: Redirect) {
        return redirect.destroy();
    }

    static getRedirectByKeyword(keyword: string) {
        return Redirect.findOne({
            where: { keyword }, include: [{
                model: Tracker,
                as: 'tracker',
            }]
        });
    }
}