
//
// Copyright 2017 by Pouya Kary. All Rights Reserved
//   This code is property of Pouya Kary and is in no way granted
//   to be used by anyone else in anyways.
//

/// <reference path="parser.ts" />

namespace Workout.LaTeX {

    //
    // ─── TYPES ──────────────────────────────────────────────────────────────────────
    //

        type Formula = Parser.IFormulaNode
        type AST = Formula[ ]

    //
    // ─── GENERATE LATEX DIAGRAM ─────────────────────────────────────────────────────
    //

        export function generateDiagram ( ast: AST ) {
            const formulas =
                ast .map( x => generateLatexForFormula( x ) )
                    .join('\n\\\\\n')

            return `\\begin{split}\n${ formulas }\n\\end{split}`
        }

    //
    // ─── GENERATE FORMULA ───────────────────────────────────────────────────────────
    //

        function generateLatexForFormula ( formula: Formula ) {
            const dependenciesCode =
                (( formula.dependencies.length > 0 )
                    ?   ( '\\ \\begin{cases}'
                        + formula.dependencies
                            .map( x => `\\text{${ x }}` )
                            .join('\\\\\n')
                        + '\\end{cases}'
                        )
                    : '')


            const formulaCode =
                `\\overbrace{${ formula.formula }}^{${ formula.symbol }}`

            return `${ formulaCode } & ${ dependenciesCode } \n`
        }

    // ────────────────────────────────────────────────────────────────────────────────

}