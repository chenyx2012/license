const NoneLicenseFiles = `
{
  "from": $from,
  "size": $size,
  "query" : {
    "constant_score" : { 
      "filter" : {
        "bool": {
          "must": [
            { "term": {"is_text": true} },
            { "term": {"repo_branch_hash": "$repoBranchHash"} }
          ],
          "must_not": [
            { "exists": {"field": "license_expressions"}}
          ]
        }
      }
    }
  },
  "sort": { "path.keyword": { "order": "asc" }}
}
`;

const SomeLicenseFiles = `
{
  "from": $from,
  "size": $size,
  "query" : {
    "constant_score" : { 
      "filter" : {
        "bool": {
          "must": [
            { "term": {"is_text": true} },
            { "term": {"repo_branch_hash": "$repoBranchHash"} },
            { "term": {"license_expressions.keyword": "$someType"} }
          ]
        }
      }
    }
  },
  "sort": { "path.keyword": { "order": "asc" }}
}
`;


const BadLicenseFiles = `
{
  "from": $from,
  "size": $size,
  "query" : {
    "constant_score" : { 
      "filter" : {
        "bool": {
          "must": [
            { "terms": {"license_expressions.keyword": [
              "GPL", "LGPL", "AGPL",
              "AGPL-1.0","AGPL-2.0","AGPL-3.0",
              "GPL-1.0","GPL-2.0","GPL-3.0",
              "AGPL-1.0","AGPL-2.0","AGPL-3.0",
               "AGPL-1.0-only","AGPL-1.0-or-later","AGPL-2.0-only","AGPL-2.0-or-later","AGPL-3.0-only","AGPL-3.0-or-later",
              "GPL-1.0-only","GPL-1.0-or-later","GPL-2.0-only","GPL-2.0-or-later","GPL-3.0-only","GPL-3.0-or-later",
              "LGPL-1.0-only","LGPL-1.0-or-later","LGPL-2.0-only","LGPL-2.0-or-later","LGPL-3.0-only","LGPL-3.0-or-later"
              ]} },
            { "term": {"repo_branch_hash": "$repoBranchHash"} }
          ],
          "must_not": [
            { "exists": {"field": "license_expressions"}}
          ]
        }
      }
    }
  },
  "sort": { "path.keyword": { "order": "asc" }}
}
`;

const LicenseTypes = `
{
  "size" : 0,
  "query": {
    "constant_score": {
      "filter": 
        { "term": { "repo_branch_hash": "$repoBranchHash"   }}
      
    }
  },
  "aggs": {
    "aggs_types": {
      "terms": { "field": "license_expressions.keyword" } 
    }
  }
}
`;

const NoneCopyrightFiles = `
{
  "from": $from,
  "size": $size,
  "query" : {
    "constant_score" : { 
      "filter" : {
        "bool": {
          "must": [
            { "term": {"is_text": true} },
            { "term": {"repo_branch_hash": "$repoBranchHash"} }
          ],
          "must_not": [
            { "exists": {"field": "copyrights"}}
          ]
        }
      }
    }
  },
  "sort": { "path.keyword": { "order": "asc" }}
}
`;

const SomeCopyrightFiles = `
{
  "from": $from,
  "size": $size,
  "query" : {
    "constant_score" : { 
      "filter" : {
        "bool": {
          "must": [
            { "term": {"is_text": true} },
            { "term": {"repo_branch_hash": "$repoBranchHash"} },
            { "term": {"copyrights.value.keyword": "$someType"} }
          ]
        }
      }
    }
  },
  "sort": { "path.keyword": { "order": "asc" }}
}
`;

const CopyrightTypes = `
{
  "size": 0,
  "query" : {
    "constant_score" : { 
      "filter" : {
        "bool": {
          "must": [
            { "term": {"is_text": true} },
            { "term": {"repo_branch_hash": "$repoBranchHash"} }
          ]
        }
      }
    }
  },
  "aggs": {
    "aggs_types": {
      "terms": { "field": "copyrights.value.keyword" } 
    }
  }
}
`;


export const Searchs: any = {
  NoneLicenseFiles,
  BadLicenseFiles,
  LicenseTypes,
  NoneCopyrightFiles,
  CopyrightTypes,
  SomeCopyrightFiles,
  SomeLicenseFiles
};



