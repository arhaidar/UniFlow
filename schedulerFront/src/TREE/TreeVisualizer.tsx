import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { useCourseContext } from "../mainpage";

const defaultTreeData = {
  "CLASS A": {
    "value": "CLASS A",
    "children": [
      "AND1A"
    ],
    "rank": 6
  },
  "AND1A": {
    "value": "AND1A",
    "children": [
      "CLASS B",
      "CLASS E"
    ],
    "rank": 6
  },
  "CLASS B": {
    "value": "CLASS B",
    "children": [
      "OR1B"
    ],
    "rank": 5
  },
  "OR1B": {
    "value": "OR1B",
    "children": [
      "CLASS C",
      "CLASS D"
    ],
    "rank": 5
  },
  "CLASS C": {
    "value": "CLASS C",
    "children": [
    ],
    "rank": 4
  },
  "CLASS D": {
    "value": "CLASS D",
    "children": [
    ],
    "rank": 3
  },
  "CLASS E": {
    "value": "CLASS E",
    "children": [
      "AND1E"
    ],
    "rank": 2
  },
  "AND1E": {
    "value": "AND1E",
    "children": [
      "CLASS F",
      "CLASS G",
      "CLASS H"
    ],
    "rank": 2
  },
  "CLASS F": {
    "value": "CLASS F",
    "children": [
    ],
    "rank": 2
  },
  "CLASS G": {
    "value": "CLASS G",
    "children": [
    ],
    "rank": 2
  },
  "CLASS H": {
    "value": "CLASS H",
    "children": [
    ],
    "rank": 2
  }
}
const rawData1 = {
  "I&CSCI 31": {
    "value": "I&CSCI 31",
    "children": [],
    "rank": 6
  },
  "I&CSCI 32": {
    "value": "I&CSCI 32",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 5
  },
  "I&CSCI 33": {
    "value": "I&CSCI 33",
    "children": [
      "I&CSCI 32"
    ],
    "rank": 4
  },
  "I&CSCI 45C": {
    "value": "I&CSCI 45C",
    "children": [
      "I&CSCI 33"
    ],
    "rank": 3
  },
  "I&CSCI 46": {
    "value": "I&CSCI 46",
    "children": [
      "I&CSCI 33",
      "I&CSCI 45C"
    ],
    "rank": 2
  }
}
const rawData2 = {
  "I&CSCI 31": {
    "value": "I&CSCI 31",
    "children": [],
    "rank": 6
  },
  "I&CSCI 32": {
    "value": "I&CSCI 32",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 5
  },
  "I&CSCI 33": {
    "value": "I&CSCI 33",
    "children": [
      "I&CSCI 32"
    ],
    "rank": 4
  },
  "I&CSCI 45C": {
    "value": "I&CSCI 45C",
    "children": [
      "I&CSCI 33"
    ],
    "rank": 3
  },
  "I&CSCI 46": {
    "value": "I&CSCI 46",
    "children": [
      "I&CSCI 33",
      "I&CSCI 45C"
    ],
    "rank": 2
  },
  "I&CSCI 51": {
    "value": "I&CSCI 51",
    "children": [
      "I&CSCI 33",
      "I&CSCI 6B"
    ],
    "rank": 2
  },
  "I&CSCI 6B": {
    "value": "I&CSCI 6B",
    "children": [],
    "rank": 3
  },
  "I&CSCI 53": {
    "value": "I&CSCI 53",
    "children": [
      "I&CSCI 46",
      "I&CSCI 51"
    ],
    "rank": 1
  },
  // "IN4MATX 43": {
  //   "value": "IN4MATX 43",
  //   "children": [
  //     "I&CSCI 32"
  //   ],
  //   "rank": 2
  // },
  "MATH 2A": {
    "value": "MATH 2A",
    "children": [
      "MATH 1B"
    ],
    "rank": 3
  },
  "MATH 1B": {
    "value": "MATH 1B",
    "children": [],
    "rank": 4
  },
  "MATH 2B": {
    "value": "MATH 2B",
    "children": [
      "MATH 2A"
    ],
    "rank": 2
  },
  "I&CSCI 6D": {
    "value": "I&CSCI 6D",
    "children": [
      "I&CSCI 6B"
    ],
    "rank": 2
  },
  "I&CSCI 6N": {
    "value": "I&CSCI 6N",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 1
  },
  "MATH 3A": {
    "value": "MATH 3A",
    "children": [
      "MATH 2B"
    ],
    "rank": 1
  },
  "STATS 67": {
    "value": "STATS 67",
    "children": [
      "MATH 2B"
    ],
    "rank": 1
  },
  "COMPSCI 161": {
    "value": "COMPSCI 161",
    "children": [
      "I&CSCI 46",
      "I&CSCI 6B",
      "I&CSCI 6D",
      "MATH 2B"
    ],
    "rank": 1
  },
  "COMPSCI 171": {
    "value": "COMPSCI 171",
    "children": [
      "STATS 67",
      "MATH 2B",
      "I&CSCI 46"
    ]
  },
  "OR178": {
    "value": "OR178",
    "children": [
      "I&CSCI 6N",
      "MATH 3A"
    ],
    "rank": 1
  },
  "COMPSCI 178": {
    "value": "COMPSCI 178",
    "children": [
      "STATS 67",
      "OR178",
      "I&CSCI 6D",
      "I&CSCI 6B"
    ]
  },
  "COMPSCI 175": {
    "value": "COMPSCI 175",
    "children": [
      "COMPSCI 178",
      "COMPSCI 171"
    ]
  },
  "Intelligence System": {
    "value": "Intelligence System",
    "children": [
      "COMPSCI 175",
      "ORIntelligence System",
    ]
  },
  "ORIntelligence System": {
    "value": "ORIntelligence System",
    "children": [
      "COMPSCI 116",
      "COMPSCI 121",
      "COMPSCI 125",
      "COMPSCI 163",
      "COMPSCI 179",
    ]
  },
  "COMPSCI 116": {
    "value": "COMPSCI 116",
    "children": [
      "OR116_1",
      "I&CSCI 6D",
      "MATH 2B",
      "I&CSCI 46"
    ]
  },
  "OR116_1": {
    "value": "OR116_1",
    "children": [
      "I&CSCI 6N",
      "MATH 3A"
    ]
  },
  "COMPSCI 121": {
    "value": "COMPSCI 121",
    "children": [
      "OR121_1",
      "STATS 67"
    ]
  },
  "OR121_1": {
    "value": "OR121_1",
    "children": [
      "I&CSCI 45C",
      "I&CSCI 45J"
    ]
  },
  "I&CSCI 45J":{
    "value": "I&CSCI 45J",
      "children": [
        "I&CSCI 33",
      ]
  },
  "COMPSCI 125": {
    "value": "COMPSCI 125",
    "children": [
      "OR125_1",
      "STATS 67"
    ]
  },
  "OR125_1": {
    "value": "OR125_1",
    "children": [
      "I&CSCI 45C",
      "I&CSCI 45J"
    ]
  },
  "COMPSCI 163": {
    "value": "COMPSCI 163",
    "children": [
      "COMPSCI 161"
    ]
  },
  "COMPSCI 179": {
    "value": "COMPSCI 179",
    "children": [
      "COMPSCI 171"
    ]
  },

}

const rawData3 = {
  "COMPSCI 171": {
    "value": "COMPSCI 171",
    "children": [
      "STATS 67",
      "I&CSCI 46",
      "MATH 2B"
    ],
    "rank": 2
  },
  "STATS 67": {
    "value": "STATS 67",
    "children": [
      "MATH 2B"
    ],
    "rank": 3
  },
  "I&CSCI 46": {
    "value": "I&CSCI 46",
    "children": [
      "I&CSCI 33",
      "I&CSCI 45C"
    ],
    "rank": 3
  },
  "MATH 2B": {
    "value": "MATH 2B",
    "children": [],
    "rank": 4
  },
  "COMPSCI 175": {
    "value": "COMPSCI 175",
    "children": [
      "COMPSCI 171",
      "COMPSCI 178"
    ],
    "rank": 1
  },
  "COMPSCI 178": {
    "value": "COMPSCI 178",
    "children": [
      "I&CSCI 6B",
      "I&CSCI 6D",
      "I&CSCI 6N",
      "MATH 2B",
      "STATS 67"
    ],
    "rank": 2
  },
  "I&CSCI 6B": {
    "value": "I&CSCI 6B",
    "children": [],
    "rank": 4
  },
  "I&CSCI 6D": {
    "value": "I&CSCI 6D",
    "children": [
      "I&CSCI 6B"
    ],
    "rank": 3
  },
  "I&CSCI 6N": {
    "value": "I&CSCI 6N",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 3
  },
  "I&CSCI 31": {
    "value": "I&CSCI 31",
    "children": [],
    "rank": 7
  },
  "I&CSCI 32": {
    "value": "I&CSCI 32",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 6
  },
  "I&CSCI H32": {
    "value": "I&CSCI H32",
    "children": [],
    "rank": 1
  },
  "I&CSCI 33": {
    "value": "I&CSCI 33",
    "children": [
      "I&CSCI 32"
    ],
    "rank": 5
  },
  "I&CSCI 45C": {
    "value": "I&CSCI 45C",
    "children": [
      "I&CSCI 33"
    ],
    "rank": 4
  },
  "I&CSCI 51": {
    "value": "I&CSCI 51",
    "children": [
      "I&CSCI 33",
      "I&CSCI 6B"
    ],
    "rank": 2
  },
  "I&CSCI 53": {
    "value": "I&CSCI 53",
    "children": [
      "I&CSCI 46",
      "I&CSCI 51"
    ],
    "rank": 1
  },
  "IN4MATX 43": {
    "value": "IN4MATX 43",
    "children": [
      "I&CSCI 32"
    ],
    "rank": 2
  },
  "MATH 3A": {
    "value": "MATH 3A",
    "children": [
      "MATH 2B"
    ],
    "rank": 2
  },
  "COMPSCI 161": {
    "value": "COMPSCI 161",
    "children": [
      "I&CSCI 46",
      "I&CSCI 6B",
      "I&CSCI 6D",
      "MATH 2B"
    ],
    "rank": 2
  },
  "I&CSCI 139W": {
    "value": "I&CSCI 139W",
    "children": [],
    "rank": 1
  },
  "COMPSCI 116": {
    "value": "COMPSCI 116",
    "children": [
      "I&CSCI 6D",
      "MATH 3A",
      "MATH 2B",
      "I&CSCI 46"
    ],
    "rank": 1
  },
  "COMPSCI 121": {
    "value": "COMPSCI 121",
    "children": [
      "I&CSCI 45C",
      "STATS 67"
    ],
    "rank": 1
  },
  "COMPSCI 125": {
    "value": "COMPSCI 125",
    "children": [
      "I&CSCI 45C",
      "STATS 67"
    ],
    "rank": 1
  },
  "COMPSCI 162": {
    "value": "COMPSCI 162",
    "children": [
      "I&CSCI 46",
      "MATH 2B",
      "I&CSCI 6B",
      "I&CSCI 6D"
    ],
    "rank": 1
  },
  "COMPSCI 163": {
    "value": "COMPSCI 163",
    "children": [
      "COMPSCI 161"
    ],
    "rank": 1
  },
  "COMPSCI 164": {
    "value": "COMPSCI 164",
    "children": [
      "I&CSCI 46"
    ],
    "rank": 1
  },
  "COMPSCI 169": {
    "value": "COMPSCI 169",
    "children": [
      "I&CSCI 6N",
      "STATS 67"
    ],
    "rank": 1
  },
  "COMPSCI 177": {
    "value": "COMPSCI 177",
    "children": [
      "MATH 2B",
      "STATS 67",
      "I&CSCI 6B",
      "I&CSCI 6D",
      "MATH 3A"
    ],
    "rank": 1
  },
  "COMPSCI 179": {
    "value": "COMPSCI 179",
    "children": [
      "COMPSCI 171"
    ],
    "rank": 1
  },
  "IN4MATX 102": {
    "value": "IN4MATX 102",
    "children": [
      "IN4MATX 101"
    ],
    "rank": 1
  },
  "IN4MATX 101": {
    "value": "IN4MATX 101",
    "children": [],
    "rank": 2
  },
  "IN4MATX 113": {
    "value": "IN4MATX 113",
    "children": [
      "I&CSCI 33",
      "IN4MATX 43"
    ],
    "rank": 1
  },
  "IN4MATX 115": {
    "value": "IN4MATX 115",
    "children": [
      "I&CSCI 45C",
      "IN4MATX 43"
    ],
    "rank": 1
  },
  "IN4MATX 117": {
    "value": "IN4MATX 117",
    "children": [
      "IN4MATX 43",
      "I&CSCI 33"
    ],
    "rank": 1
  },
  "IN4MATX 121": {
    "value": "IN4MATX 121",
    "children": [
      "I&CSCI 33"
    ],
    "rank": 1
  },
  "IN4MATX 122": {
    "value": "IN4MATX 122",
    "children": [
      "I&CSCI 46",
      "IN4MATX 101"
    ],
    "rank": 1
  },
  "IN4MATX 124": {
    "value": "IN4MATX 124",
    "children": [
      "COMPSCI 132",
      "I&CSCI 45J"
    ],
    "rank": 1
  },
  "COMPSCI 132": {
    "value": "COMPSCI 132",
    "children": [],
    "rank": 2
  },
  "I&CSCI 45J": {
    "value": "I&CSCI 45J",
    "children": [],
    "rank": 2
  },
  "IN4MATX 131": {
    "value": "IN4MATX 131",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 2
  },
  "IN4MATX 133": {
    "value": "IN4MATX 133",
    "children": [
      "I&CSCI 45C"
    ],
    "rank": 2
  },
  "IN4MATX 134": {
    "value": "IN4MATX 134",
    "children": [
      "IN4MATX 131",
      "IN4MATX 133"
    ],
    "rank": 1
  },
  "I&CSCI 162": {
    "value": "I&CSCI 162",
    "children": [
      "I&CSCI 61",
      "GDIM 25"
    ],
    "rank": 1
  },
  "I&CSCI 61": {
    "value": "I&CSCI 61",
    "children": [],
    "rank": 2
  },
  "GDIM 25": {
    "value": "GDIM 25",
    "children": [],
    "rank": 2
  }
}

const testData =  {
  "COMPSCI 171": {
    "value": "COMPSCI 171",
    "children": [
      "AND1171"
    ],
    "rank": 3
  },
  "AND1171": {
    "value": "AND1171",
    "children": [
      "STATS 67",
      "I&CSCI 46",
      "MATH 2B"
    ],
    "rank": 4
  },
  "STATS 67": {
    "value": "STATS 67",
    "children": [
      "MATH 2B"
    ],
    "rank": 5
  },
  "I&CSCI 46": {
    "value": "I&CSCI 46",
    "children": [
      "AND146"
    ],
    "rank": 5
  },
  "MATH 2B": {
    "value": "MATH 2B",
    "children": [
      "MATH 2A"
    ],
    "rank": 7
  },
  "COMPSCI 175": {
    "value": "COMPSCI 175",
    "children": [
      "AND1175"
    ],
    "rank": 1
  },
  "AND1175": {
    "value": "AND1175",
    "children": [
      "COMPSCI 171",
      "COMPSCI 178"
    ],
    "rank": 2
  },
  "COMPSCI 178": {
    "value": "COMPSCI 178",
    "children": [
      "AND1178"
    ],
    "rank": 3
  },
  "AND1178": {
    "value": "AND1178",
    "children": [
      "I&CSCI 6B",
      "I&CSCI 6D",
      "OR1178",
      "MATH 2B",
      "STATS 67"
    ],
    "rank": 4
  },
  "I&CSCI 6B": {
    "value": "I&CSCI 6B",
    "children": [],
    "rank": 6
  },
  "I&CSCI 6D": {
    "value": "I&CSCI 6D",
    "children": [
      "I&CSCI 6B"
    ],
    "rank": 5
  },
  "OR1178": {
    "value": "OR1178",
    "children": [
      "I&CSCI 6N",
      "MATH 3A"
    ],
    "rank": 5
  },
  "I&CSCI 6N": {
    "value": "I&CSCI 6N",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 6
  },
  "MATH 3A": {
    "value": "MATH 3A",
    "children": [
      "MATH 2B"
    ],
    "rank": 6
  },
  "I&CSCI 31": {
    "value": "I&CSCI 31",
    "children": [],
    "rank": 10
  },
  "I&CSCI 32": {
    "value": "I&CSCI 32",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 9
  },
  "I&CSCI H32": {
    "value": "I&CSCI H32",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 1
  },
  "I&CSCI 33": {
    "value": "I&CSCI 33",
    "children": [
      "I&CSCI 32"
    ],
    "rank": 8
  },
  "I&CSCI 45C": {
    "value": "I&CSCI 45C",
    "children": [
      "I&CSCI 33"
    ],
    "rank": 7
  },
  "AND146": {
    "value": "AND146",
    "children": [
      "I&CSCI 33",
      "I&CSCI 45C"
    ],
    "rank": 6
  },
  "I&CSCI 51": {
    "value": "I&CSCI 51",
    "children": [
      "AND151"
    ],
    "rank": 3
  },
  "AND151": {
    "value": "AND151",
    "children": [
      "I&CSCI 33",
      "I&CSCI 6B"
    ],
    "rank": 4
  },
  "I&CSCI 53": {
    "value": "I&CSCI 53",
    "children": [
      "AND153"
    ],
    "rank": 1
  },
  "AND153": {
    "value": "AND153",
    "children": [
      "I&CSCI 46",
      "I&CSCI 51"
    ],
    "rank": 2
  },
  "IN4MATX 43": {
    "value": "IN4MATX 43",
    "children": [
      "I&CSCI 32"
    ],
    "rank": 3
  },
  "MATH 2A": {
    "value": "MATH 2A",
    "children": [],
    "rank": 8
  },
  "COMPSCI 161": {
    "value": "COMPSCI 161",
    "children": [
      "AND1161"
    ],
    "rank": 2
  },
  "AND1161": {
    "value": "AND1161",
    "children": [
      "I&CSCI 46",
      "I&CSCI 6B",
      "I&CSCI 6D",
      "MATH 2B"
    ],
    "rank": 3
  },
  "I&CSCI 139W": {
    "value": "I&CSCI 139W",
    "children": [],
    "rank": 1
  },
  "COMPSCI 116": {
    "value": "COMPSCI 116",
    "children": [
      "AND1116"
    ],
    "rank": 1
  },
  "AND1116": {
    "value": "AND1116",
    "children": [
      "I&CSCI 6D",
      "OR1116",
      "MATH 2B",
      "I&CSCI 46"
    ],
    "rank": 2
  },
  "OR1116": {
    "value": "OR1116",
    "children": [
      "MATH 3A",
      "I&CSCI 6N"
    ],
    "rank": 3
  },
  "COMPSCI 121": {
    "value": "COMPSCI 121",
    "children": [
      "AND1121"
    ],
    "rank": 1
  },
  "AND1121": {
    "value": "AND1121",
    "children": [
      "I&CSCI 45C",
      "STATS 67"
    ],
    "rank": 2
  },
  "COMPSCI 125": {
    "value": "COMPSCI 125",
    "children": [
      "AND1125"
    ],
    "rank": 1
  },
  "AND1125": {
    "value": "AND1125",
    "children": [
      "I&CSCI 45C",
      "STATS 67"
    ],
    "rank": 2
  },
  "COMPSCI 162": {
    "value": "COMPSCI 162",
    "children": [
      "AND1162"
    ],
    "rank": 1
  },
  "AND1162": {
    "value": "AND1162",
    "children": [
      "I&CSCI 46",
      "MATH 2B",
      "I&CSCI 6B",
      "I&CSCI 6D"
    ],
    "rank": 2
  },
  "COMPSCI 163": {
    "value": "COMPSCI 163",
    "children": [
      "COMPSCI 161"
    ],
    "rank": 1
  },
  "COMPSCI 164": {
    "value": "COMPSCI 164",
    "children": [
      "I&CSCI 46"
    ],
    "rank": 1
  },
  "COMPSCI 169": {
    "value": "COMPSCI 169",
    "children": [
      "AND1169"
    ],
    "rank": 1
  },
  "AND1169": {
    "value": "AND1169",
    "children": [
      "OR1169",
      "STATS 67"
    ],
    "rank": 2
  },
  "OR1169": {
    "value": "OR1169",
    "children": [
      "I&CSCI 6N",
      "MATH 3A"
    ],
    "rank": 3
  },
  "COMPSCI 177": {
    "value": "COMPSCI 177",
    "children": [
      "AND1177"
    ],
    "rank": 1
  },
  "AND1177": {
    "value": "AND1177",
    "children": [
      "MATH 2B",
      "STATS 67",
      "I&CSCI 6B",
      "I&CSCI 6D",
      "OR1177"
    ],
    "rank": 2
  },
  "OR1177": {
    "value": "OR1177",
    "children": [
      "MATH 3A",
      "I&CSCI 6N"
    ],
    "rank": 3
  },
  "COMPSCI 179": {
    "value": "COMPSCI 179",
    "children": [
      "COMPSCI 171"
    ],
    "rank": 1
  },
  "IN4MATX 102": {
    "value": "IN4MATX 102",
    "children": [],
    "rank": 1
  },
  "IN4MATX 113": {
    "value": "IN4MATX 113",
    "children": [
      "AND1113"
    ],
    "rank": 1
  },
  "AND1113": {
    "value": "AND1113",
    "children": [
      "I&CSCI 33",
      "IN4MATX 43"
    ],
    "rank": 2
  },
  "IN4MATX 115": {
    "value": "IN4MATX 115",
    "children": [
      "AND1115"
    ],
    "rank": 1
  },
  "AND1115": {
    "value": "AND1115",
    "children": [
      "OR1115",
      "IN4MATX 43"
    ],
    "rank": 2
  },
  "OR1115": {
    "value": "OR1115",
    "children": [
      "I&CSCI 45C",
      "I&CSCI 46"
    ],
    "rank": 3
  },
  "IN4MATX 117": {
    "value": "IN4MATX 117",
    "children": [
      "AND1117"
    ],
    "rank": 1
  },
  "AND1117": {
    "value": "AND1117",
    "children": [
      "IN4MATX 43",
      "I&CSCI 33"
    ],
    "rank": 2
  },
  "IN4MATX 121": {
    "value": "IN4MATX 121",
    "children": [
      "I&CSCI 33"
    ],
    "rank": 1
  },
  "IN4MATX 122": {
    "value": "IN4MATX 122",
    "children": [
      "I&CSCI 46"
    ],
    "rank": 1
  },
  "IN4MATX 124": {
    "value": "IN4MATX 124",
    "children": [],
    "rank": 1
  },
  "IN4MATX 131": {
    "value": "IN4MATX 131",
    "children": [
      "I&CSCI 31"
    ],
    "rank": 3
  },
  "IN4MATX 133": {
    "value": "IN4MATX 133",
    "children": [
      "I&CSCI 45C"
    ],
    "rank": 3
  },
  "IN4MATX 134": {
    "value": "IN4MATX 134",
    "children": [
      "AND1134"
    ],
    "rank": 1
  },
  "AND1134": {
    "value": "AND1134",
    "children": [
      "IN4MATX 131",
      "IN4MATX 133"
    ],
    "rank": 2
  },
  "I&CSCI 162": {
    "value": "I&CSCI 162",
    "children": [],
    "rank": 1
  }
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface CourseNode {
  value: string;
  children: string[];
  rank: number;
}

interface CourseData {
  [key: string]: CourseNode;
}

const convertToTreeData = (data: CourseData, nodeName: string): TreeNode => {
  const node = data[nodeName];
  const children = node.children.map((childName: string) => convertToTreeData(data, childName));

  return {
    name: node.value,
    children: children.length > 0 ? children : undefined
  };
};

const findHighestNodes = (data: CourseData): string[] => {
  const result: string[] = [];
  const allKeys = Object.keys(data);
  const allChildren = Object.values(data)
    .map(node => node.children)
    .flat();
  
  allKeys.forEach(key => {
    if (!allChildren.includes(key)) {
      result.push(data[key].value);
    }
  });
  
  return result;
};

const findNodeInTree = (
  tree: TreeNode, 
  nodeName: string, 
  depth: number
): { node: TreeNode | null, parent: TreeNode | null } => {
  if (tree.name === nodeName) {
    return { node: tree, parent: null };
  }

  if (tree.children) {
    for (let child of tree.children) {
      const result = findNodeInTree(child, nodeName, depth + 1);
      if (result.node) {
        return { node: result.node, parent: tree };
      }
    }
  }

  return { node: null, parent: null };
};

const dfsTraverseAndConnect = (
  data: CourseData, 
  nodeName: string, 
  visited: Set<string>, 
  rootNode: TreeNode, 
  depth: number
): void => {
  if (visited.has(nodeName)) return;
  
  const node = data[nodeName];
  visited.add(nodeName);

  const treeData = convertToTreeData(data, nodeName);
  // console.log("tree data", treeData)
  const { node: existingNode, parent } = findNodeInTree(rootNode, nodeName, depth);

  if (existingNode && parent) {
    // this one adds everything...
    // parent.children = parent.children?.filter(child => child !== existingNode);
    // parent.children?.push(treeData);
  } else if (!existingNode) {
    rootNode.children = rootNode.children || [];
    rootNode.children.push(treeData);
  }

  node.children.forEach((childName: string) => {
    dfsTraverseAndConnect(data, childName, visited, rootNode, depth + 1);
  });
};

const generateTreeData = (data: CourseData): TreeNode => {
  const rootNode: TreeNode = {
    name: "Graduation",
    children: []
  };

  const visited = new Set<string>();
  const highestNodes = findHighestNodes(data);
  // console.log("highest....", highestNodes);

  highestNodes.forEach(nodeName => {
    Object.entries(data).forEach(([key, node]) => {
      if (node.value === nodeName && !visited.has(key)) {
        dfsTraverseAndConnect(data, key, visited, rootNode, 0);
      }
    });
  });

  return rootNode;
};



export const TreeVisualizer = () => {
  const { state, dispatch } = useCourseContext();
  const [tree, setTree] = useState<CourseData | undefined>(undefined);
  
  const copy_state = state; //get copy of it (don't touch original)
  const combineStateToJSON = (graduationDate?: string): object => {
    return {
      taken: Array.from(copy_state.taken),
      need_complete: Array.from(copy_state.need_complete),
      need_elective: Array.from(copy_state.need_elective),
      need_project: Array.from(copy_state.need_project),
      need_others: Array.from(copy_state.need_others),
      major: 'computer_science',
      prefer: copy_state.prefer,
      num_total: copy_state.num_total,
      num_project: copy_state.num_project,
      graduation_date: graduationDate,
    };
  };
  
  // API CALL to get 1) tree data 2) next class data
  const getTreeData = async (wholeList: object) => {
    try {
      const response = await fetch('http://localhost:3000/process/treedata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wholeList), // Only stringify here
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching next plan:', error);
      throw error;
    }
  };

  const renderTreeData = async () => {
    const combinedData = combineStateToJSON();
    try {
      const backendtreedata = await getTreeData(combinedData);
      if(backendtreedata.success) {
        const formattedTree: CourseData = Object.entries(backendtreedata.treedata.nodes).reduce(
          (acc, [key, value]) => {
            const courseNode = value as CourseNode; // Explicitly type value
      
            acc[key] = {
              ...courseNode, // Now TypeScript knows the structure
              rank: courseNode.rank ?? 0, // Ensure rank is always a number
            };
      
            return acc;
          },
          {} as CourseData
        );
        console.log("SAVING....", formattedTree)
        setTree(formattedTree);
      }
    }
    catch(error) {
      console.error("Error fetching data from the backend:", error);
      alert("An error occurred while fetching data.");
    }
  }
  useEffect(() => {
    renderTreeData();
  },[])

  console.log("CHECK!!!!:::", tree)
  let treeData = tree; // Default to provided data

  if (!treeData) { // If treeData is null or undefined
    console.log("undefined11111111");
    treeData = defaultTreeData; // Use backup data
  } else {
    console.log("Getting data");
  }
  
    const treedata:TreeNode = generateTreeData(treeData);

    const firstLevelChildren = treedata.children || []; // Adjust based on the structure of `treedata`

    const renderRectSvgNode = ({ nodeDatum, toggleNode }: any) => {
      const fontSize = 20;
      const padding = 6; // Space around text
      const rectWidth = nodeDatum.name.length * fontSize * 0.6 + padding * 1; // Approximate width
      const rectHeight = fontSize + padding * 2; // Approximate height

      const isChild = nodeDatum.children;
      const isOrNode = nodeDatum.name.includes("OR"); // 'OR' 포함 여부
      const isAndNode = nodeDatum.name.includes("AND"); // 'AND' 포함 여부

      let displayText;
      if (isOrNode) {
          displayText = "One of";
      } else if (isAndNode) {
          displayText = "All of";
      } else {
          displayText = nodeDatum.name; // 'OR' 또는 'AND'가 아니면 원래 이름
      }

      const rectFill = "white"; // 'OR' 포함 시 색상 변경
      const fillcolor = isOrNode ? "white" : isAndNode ? "white" : isChild ? "gray" : "white";
      const color = isAndNode ? "none" : (isOrNode ? rectFill : (isChild ? "gray" : "white")); // 'AND'일 경우 배경 색상 none
      const border = isOrNode ? rectFill : (isAndNode ? "none" : (isChild ? "black" : "black")); // 'AND'일 경우 border도 none  

      //for 'or' & 'and' position
      const yPosition1 = isOrNode ? rectHeight + 2 : isAndNode ? rectHeight + 2 : -rectHeight / 1.7;
      const yPosition2 = isOrNode ? rectHeight + 21 : isAndNode ? rectHeight + 21 : "";

      return (
        <g onClick={toggleNode} >
          {/* Background rectangle */}
          <rect 
            width={rectWidth} 
            height={rectHeight} 
            x={-rectWidth / 2} 
            y={yPosition1} 
            fill={fillcolor} //2 cases -> one for 'or' one for rectFill
            stroke={border}
            strokeWidth={2} // 추가: 테두리 두께 설정
          />
          <text 
            fill="black" 
            strokeWidth="0"
            y={yPosition2}
            fontSize={fontSize} 
            textAnchor="middle" 
            alignmentBaseline="middle"
          >
            {displayText}
          </text>
        </g>
      );
    };
    const numChildren = firstLevelChildren.length;
    const boxsize1 = 400;
    const x_center = 125; // Horizontal movement for center main class
    const y_center = 80; // Vertical movement for center main class
    //use this as center
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Automatic columns        justifyContent: "center", // Center horizontally
          gap: "8px", // Small gap for spacing
          height: "100%", // Fill second-portion height
          width: "100%", // Fill second-portion width
          boxSizing: "border-box",
        }}
      >      
        {/* {firstLevelChildren.map((child, index) => ( */}
          <div
            // key={index}
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #000",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // transform: "scale(0.94)",
            }}
          >
            {/* <button>ICON TO BIGGER *AT THE TOP RIGHT</button>  */}
            <Tree
              data={treedata}
              orientation="vertical"
              pathFunc="step" // Makes the connection lines straight
              separation={{ siblings: 1, nonSiblings: 1 }}
              depthFactor={100} //length of connection line
              nodeSize={{ x: 130, y: 50 }} // Adjusts node spacing
              renderCustomNodeElement={renderRectSvgNode} //custom setting
              translate={{ x: x_center, y: y_center }} // Apply the translation
              scaleExtent={{ min: 0.2, max: 4 }} // Allow zoom-out + first-render
              zoomable={true} // Enable zoomable
            />
            
          </div>
          {/* ))} */}
      </div>
    );
  };
