const assert = require("assert");
const jq = require("jquery-deferred");
const $ = require("cheerio"); 
const DATA = require("./data");

jq.ajax = (conf) => {
  const endpoint = conf["url"];
  const user = conf["data"]["id"] || conf["data"]["user_id"];
  const dfd = new jq.Deferred;
  dfd.resolve(DATA[endpoint][user]);
  return dfd.promise();
};

global["jQuery"] = Object.assign($, jq);

require("../core/aojil");

describe("aojil", () => {
  describe("getSolve", () => {
    it("parse check", (done) => {
      aojil.getSolve("orisano").then((r) => {
        assert.equal(r.id, "orisano");
        assert.equal(r.solved, 413);
        done();
      });
    });
  });
  describe("getSolves", () => {
    it("parse check", (done) => {
      aojil.getSolves("orisano").then(() => {
        done();
      });
    });
  });
});
