var GLOBAL = GLOBAL || (this || 0).self || global;

(function moduleExporter(name, entity) {
  "use strict";

  if (typeof module !== "undefined") {
    module["exports"] = entity;
  }
  else {
    GLOBAL[name] = entity;
  }

  return entity;
})("aojil", (function moduleClosure(global) {
  "use strict";

  var aojil = {
    "getSolve": getSolve,
    "getSolveList": getSolveList,
    "getSolves": getSolves,
    "getSolvesList": getSolvesList,
    "getStatus": getStatus,
    "getStatusList": getStatusList,
  };

  var SCHEME = "http";
  var HOST = "judge.u-aizu.ac.jp";
  var URL_PATH = "onlinejudge/webservice";
  var API_BASE = SCHEME + "://" + HOST + "/" + URL_PATH;

  var jq = global.jQuery;

  function getSolve(user){ return reqAPI("/user", {"id": user}, parseSolve); }
  function getSolveList(userList) { return getPromiseList(userList, getSolve); }
  function getSolves(user){ return reqAPI("/user", {"id": user}, parseSolves); }
  function getSolvesList(userList) { return getPromiseList(userList, getSolves); }
  function getStatus(user) { return reqAPI("/status_log", {"user_id": user}, parseStatus); }
  function getStatusList(userList) { return getPromiseList(userList, getStatus); }

  function toDOM(xml) {
    return jq(xml);
  }

  function getPromiseList(list, func) {
    return jq.when.apply(jq, list.map(func));
  }

  function getXML(url, params) {
    return jq.ajax({
      "type": "GET",
      "url": url,
      "data": params,
      "dataType": "xml",
    });
  }

  function reqAPI(endpoint, params, parseFunc) {
    params = params || {};
    parseFunc = parseFunc || function(x){ return x; };
    var url = API_BASE + endpoint;
    return getXML(url, params).then(parseFunc);
  }

  function parseXML(xml, schema) {
    var $xml = toDOM(xml);
    var obj = {};
    Object.keys(schema).forEach(function(selector) {
      var key = selector.split(">").pop();
      obj[key] = schema[selector]($xml.find(selector).text());
    });
    return obj;
  }

  function parseStatus(xml) {
    var statusSchema = {
      "status>run_id": String,
      "status>problem_id": String,
      "status>language": String,
      "status>cputime": Number,
      "status>memory": Number,
      "status>code_size": Number,
      "status>user_id": String,
      "status>status": String,
      "status>submission_date": Number,
      "status>submission_date_str": String,
    };
    var statusList = toDOM(xml).find("status_list>status");
    return statusList.map(function(status){ return parseXML(status, statusSchema); });
  }

  function parseSolve(xml) {
    var solveSchema = {
      "user>id": String,
      "user>status>solved": Number,
    };
    return parseXML(xml, solveSchema);
  }

  function parseSolves(xml) {
    var $xml = toDOM(xml);
    return $xml.find("user>solved_list>problem>id").map(function(id){
      return toDOM(id).text();
    });
  }

  return aojil;
})(GLOBAL));
