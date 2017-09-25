"use strict";
var Workout;
(function (Workout) {
    var Parser;
    (function (Parser) {
        function parse(code) {
            const lines = code.split('\n')
                .filter(line => !/^\s*$/.test(line));
            for (const line of lines) {
                const splinted = line.split('=');
                if (splinted.length !== 2)
                    throw { line: line, message: "Has more than one definition sign" };
                if (!/^[a-z]$/.test(splinted[0].trim()))
                    throw { line: line, message: "Bad formula symbol" };
            }
            const formulas = lines.map(line => {
                const [name, rule] = line.split('=');
                return {
                    dependencies: fetchSymbols(rule),
                    formula: rule.trim(),
                    symbol: name.trim(),
                };
            });
            return formulas;
        }
        Parser.parse = parse;
        function fetchSymbols(rule) {
            const matches = new Array();
            rule.replace(/(?:\b((?:[a-z])+)\b)(?!(?:\s)*\()/g, match => {
                matches.push(match);
                return '';
            });
            return matches;
        }
    })(Parser = Workout.Parser || (Workout.Parser = {}));
})(Workout || (Workout = {}));
var Octobass;
(function (Octobass) {
    function exec(data, func) {
        const computedData = {};
        let countDownCounter = data.length;
        let lastCountDownCounterBackup = Infinity;
        while (countDownCounter > 0) {
            lastCountDownCounterBackup = countDownCounter;
            for (const input of data)
                countDownCounter =
                    tryToCompute(input, computedData, countDownCounter, func);
            if (lastCountDownCounterBackup === countDownCounter)
                return computedData;
        }
        return computedData;
    }
    Octobass.exec = exec;
    function tryToCompute(inputData, computedData, countDownCounter, func) {
        if (!isComputable(inputData, computedData))
            return countDownCounter;
        computedData[inputData.info.id] =
            func(computedData, inputData);
        return countDownCounter - 1;
    }
    function isComputable(inputData, computedData) {
        for (const id of inputData.dependencies)
            if (computedData[id] === undefined)
                return false;
        return true;
    }
})(Octobass || (Octobass = {}));
var Workout;
(function (Workout) {
    var OctobassAdapter;
    (function (OctobassAdapter) {
        function compute(ast) {
            const octobassData = createOctobassData(ast);
            const computedValue = Octobass.exec(octobassData, octobassComputingFunction);
            return computedValue;
        }
        OctobassAdapter.compute = compute;
        function createOctobassData(ast) {
            return ast.map(node => ({
                info: {
                    id: node.symbol,
                    name: node.symbol,
                },
                dependencies: new Set(node.dependencies),
                formula: node.formula
            }));
        }
        function octobassComputingFunction(computedData, input) {
            const functionDataAsConstants = [...input.dependencies]
                .map(symbol => `const ${symbol} = ${computedData[symbol]};`)
                .join('\n');
            const funcString = (`(( ) => {
                const { PI, E, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, random, round } = Math;
                ${functionDataAsConstants}
                return ${input.formula};
            })( )`);
            const computedValue = eval(funcString);
            return computedValue;
        }
    })(OctobassAdapter = Workout.OctobassAdapter || (Workout.OctobassAdapter = {}));
})(Workout || (Workout = {}));
var Workout;
(function (Workout) {
    function compute(code) {
        const ast = Workout.Parser.parse(code);
        const computed = Workout.OctobassAdapter.compute(ast);
        return {
            ast: ast,
            results: computed
        };
    }
    Workout.compute = compute;
})(Workout || (Workout = {}));
var Workout;
(function (Workout) {
    var UI;
    (function (UI) {
        const localStorageId = 'us.kary.workout.code';
        window.onload = () => {
            checkAndLoadCodeInLocalStorage();
            onInputChange();
            const inputBox = document.getElementById('code-input');
            inputBox.onchange = onInputChange;
            inputBox.oninput = onInputChange;
            inputBox.onkeyup = onInputChange;
        };
        function checkAndLoadCodeInLocalStorage() {
            const code = localStorage.getItem(localStorageId);
            if (code)
                document.getElementById('code-input')
                    .value = code;
        }
        function onInputChange() {
            try {
                const input = document.getElementById('code-input')
                    .value;
                const computedResults = Workout.compute(input);
                renderLaTeX(computedResults.ast);
                prettyPrintResults(computedResults.results);
                localStorage.setItem(localStorageId, input);
            }
            catch (_a) {
            }
        }
        UI.onInputChange = onInputChange;
        function prettyPrintResults(results) {
            document.getElementById('results').innerHTML =
                Object.keys(results).map(key => results[key]
                    ? `<b>${key}</b> &rightarrow; <b>${results[key]}</b>`
                    : null)
                    .join('<br/>');
        }
        function renderLaTeX(ast) {
            const katexDisplay = document.getElementById('katex-display');
            const compiledTeX = Workout.LaTeX.generateDiagram(ast);
            console.log(compiledTeX);
            katexDisplay.innerHTML =
                katex.renderToString(compiledTeX, { displayMode: true });
        }
    })(UI = Workout.UI || (Workout.UI = {}));
})(Workout || (Workout = {}));
var Workout;
(function (Workout) {
    var LaTeX;
    (function (LaTeX) {
        function generateDiagram(ast) {
            const formulas = ast.filter(x => x.dependencies.length > 0)
                .map(x => generateLatexForFormula(x))
                .join('\n\\\\[7pt]\n');
            return `\\begin{aligned}\n${formulas}\n\\end{aligned}`;
        }
        LaTeX.generateDiagram = generateDiagram;
        function generateLatexForFormula(formula) {
            const dependenciesCode = ((formula.dependencies.length > 0)
                ? ('\\ \\begin{cases}'
                    + formula.dependencies
                        .map(x => `\\text{${x}}`)
                        .join('\\\\\n')
                    + '\\end{cases}')
                : '');
            return `${formula.symbol} & ${dependenciesCode}`;
        }
    })(LaTeX = Workout.LaTeX || (Workout.LaTeX = {}));
})(Workout || (Workout = {}));
