/**
 * It converts a decimal to binary and
 * adds insignificant zeros considering
 * @length.
 *
 * @param int dec
 * @param int length
 *
 * @return string 
 */
function dec2bin(dec, length) {
  let bin = (dec >>> 0).toString(2);

  if (length != undefined) {
    let cnt = length - bin.length;
    
    if (cnt > 0) {
      bin = "0".repeat(cnt) + bin;
    }
  }

  return bin;
}

/**
 * It calculates the difference between two
 * strings of the same length and returns
 * a general pattern.
 *
 * @param string a
 * @param string b
 *
 * @param Object { tpl: String, cnt: int }
 */
function diff(a, b) {
  let diffCount = 0;

  let values = a.split("").map((v, i) => {
    if (b[i] !== v) {
      diffCount++;
      return "-";
    }

    return v;
  });

  return { tpl: values.join(""), cnt: diffCount };
}

/**
 * It compares two objects.
 *
 * @param int x
 * @param int y
 *
 * @return bool
 */
Object.equals = function(x, y) {
  if (x === y)
    return true;

  if (!(x instanceof Object) || ! (y instanceof Object))
    return false;

  if (x.constructor !== y.constructor)
    return false;

  for (let p in x) {
    if (!x.hasOwnProperty(p))
      continue;

    if (!y.hasOwnProperty(p))
      return false;

    if (x[p] === y[p])
      continue;

    if (typeof(x[p]) !== "object")
      return false;

    if (!Object.equals(x[p], y[p]))
      return false;
  }

  for (p in y)
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
      return false;

  return true;
}

/**
 * Algorithm for finding a reduced disjunctive normal form
 *
 * @param array args    Function arguments
 * @param array points  Points where function takes true-defined values
 *
 * @return Object { columns, F, L } Columns are for the patterns
 *                                  F is for gotten function
 *                                  L is for its complexity      
 */
function reducedDNF(args, points) {
  let columns = [];

  // Creating a first column
  columns.push({});

  for (let i = 0; i < points.length; i++)
    columns[0][dec2bin(points[i], args.length)] = false;

  // Algorithm
  let columnIndex = 0;

  while (1) {
    let column = Object.keys(columns[columnIndex]);

    // Create next column
    columns.push({});

    // Compare each element with each within one column 
    for (let i = 0; i < column.length; i++) {
      for (let j = 0; j < column.length; j++) {
        let d = diff(column[i], column[j]);

        if (d.cnt !== 1)
          continue;

        columns[columnIndex][column[i]] = true;
        columns[columnIndex + 1][d.tpl] = false;
      }
    }

    // If some elements weren't combined together,
    // move 'em to the next column
    for (let i = 0; i < column.length; i++)
      if (columns[columnIndex][column[i]] === false)
        columns[columnIndex + 1][column[i]] = false;

    // Check if the algorithm finished
    if (Object.equals(columns[columnIndex], columns[columnIndex + 1])) {
      columns.pop();
      break;
    }

    columnIndex++;
  }

  // Form the function and its complexity
  let F = [],
    L = 0;

  Object
    .keys(columns[columns.length - 1])
    .forEach(tpl => {
      let f = "";

      tpl.split("").forEach((d, i) => {
        d = parseInt(d);

        if (isNaN(d))
          return;

        f += (d === 1 ? "" : "¬") + args[i];
        L++;
      });

      F.push(f);
    });

  F = F.join(" + ");

  // Form better columns for output
  let c = [];
  columns.forEach(column => c.push(Object.keys(column)));

  return { columns: c, F, L };
}

module.exports = reducedDNF;