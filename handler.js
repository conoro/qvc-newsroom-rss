"use strict";
// QVC Newsroom RSS - Copyright Conor O'Neill 2022, conor@conoroneill.com
// LICENSE Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.rss = exports.QVCScraper = void 0;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var feed_1 = require("feed");
var QVCScraper = /** @class */ (function () {
    function QVCScraper() {
    }
    QVCScraper.prototype.scrapeNews = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var feed, response, html, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        feed = new feed_1.Feed({
                            title: "QVC Newsroom Feed",
                            description: "RSS feed for QVC news website",
                            id: "https://corporate.qvc.com/newsroom/",
                            link: "https://corporate.qvc.com/newsroom/",
                            language: "en",
                            image: "https://corporate.qvc.com/wp-content/plugins/newsroom/themes/qvc-corporate/images/QVC_PrimaryLogo.png",
                            favicon: "https://corporate.qvc.com/wp-content/plugins/newsroom/themes/qvc-corporate/images/favicon/favicon-196x196.png",
                            copyright: "2022 © Athletics Ireland. All Rights Reserved.",
                            updated: new Date(),
                            generator: "AWS Lambda",
                            feedLinks: {
                                rss: "https://example.com/rss"
                            },
                            author: {
                                name: "QVC",
                                email: "example@example.com",
                                link: "https://corporate.qvc.com/lp/contact-us/"
                            }
                        });
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 1:
                        response = _a.sent();
                        html = response.data;
                        $ = cheerio_1["default"].load(html);
                        $("article").each(function () {
                            var story = $(this).find(".article-detail").find("a").first();
                            if (story) {
                                var postLink = story.attr("href");
                                var postText = story.attr("title");
                                if (postLink && postText) {
                                    var pubdate = $(this).find(".dotdotdot").text().split(":")[0];
                                    var publishDateTime = new Date(pubdate + " 06:00");
                                    var imageURL = $(this).find(".featured-img-container").attr("style").match(/\((.*?)\)/)[1].replace(/('|")/g, '');
                                    feed.addItem({
                                        title: postText,
                                        id: postLink,
                                        link: postLink || '',
                                        description: postText,
                                        content: '<img src="' + imageURL + '"/><br>' + '<a href="' + postLink + '">' + postText + "</a>",
                                        author: [
                                            {
                                                name: "QVC",
                                                email: "example@example.com",
                                                link: "https://corporate.qvc.com/lp/contact-us/"
                                            }
                                        ],
                                        date: publishDateTime,
                                        image: imageURL
                                    });
                                }
                            }
                        });
                        return [2 /*return*/, (feed.rss2())];
                }
            });
        });
    };
    return QVCScraper;
}());
exports.QVCScraper = QVCScraper;
var rss = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var scraper, feed, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scraper = new QVCScraper();
                return [4 /*yield*/, scraper.scrapeNews("https://corporate.qvc.com/newsroom/")];
            case 1:
                feed = _a.sent();
                response = {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'text/xml'
                    },
                    body: feed
                };
                return [2 /*return*/, (response)];
        }
    });
}); };
exports.rss = rss;
