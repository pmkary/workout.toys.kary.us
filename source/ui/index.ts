
//
// Copyright 2017 by Pouya Kary. All Rights Reserved
//   This code is property of Pouya Kary and is in no way granted
//   to be used by anyone else in anyways.
//

/// <reference path="../core/index.ts" />

namespace Workout.UI {

    //
    // ─── HELPING DECELERATIONS ──────────────────────────────────────────────────────
    //

        declare module katex {
            function renderToString ( a: any, b: any ): string
        }

        type Formula = Parser.IFormulaNode
        type Results = Octobass.IOctobassComputedDependencies<number>
        type AST = Formula[ ]

    //
    // ─── CONSTANTS ──────────────────────────────────────────────────────────────────
    //

        const localStorageId = 'us.kary.workout.code'

    //
    // ─── MAIN ───────────────────────────────────────────────────────────────────────
    //

        window.onload = ( ) => {
            checkAndLoadCodeInLocalStorage( )
            onInputChange( )

            const inputBox =
                document.getElementById('code-input')!

            inputBox.onchange   = onInputChange
            inputBox.oninput    = onInputChange
            inputBox.onkeyup    = onInputChange
        }

    //
    // ─── LOAD IF TEXT IS IN LOCAL STORAGE ───────────────────────────────────────────
    //

        function checkAndLoadCodeInLocalStorage ( ) {
            const input =
                ( document.getElementById('code-input') as HTMLTextAreaElement )!
            const defaultCode =
                input.value = (
                    [   "a = 2"
                    ,   "y = x + 2"
                    ,   "x = 3 * a"
                    ,   "z = y + w"
                    ]
                    .join('\n')
                )

            try {
                const code =
                    localStorage.getItem( localStorageId )

                if ( code )
                    input.value = code
                else
                    input.value = defaultCode
            } catch {
                input.value = defaultCode
            }
        }

    //
    // ─── ON CHANGE ──────────────────────────────────────────────────────────────────
    //

        function onInputChange ( ) {
            try {
                const input =
                    ( document.getElementById('code-input') as HTMLTextAreaElement )!
                    .value

                const computedResults =
                    Workout.compute( input )

                renderDependencyLaTeX( computedResults.ast )
                prettyPrintResults( computedResults.results )

                localStorage.setItem( localStorageId, input )

            } catch {
                // who cares...
            }
        }

    //
    // ─── PRETTY PRINT RESULTS ───────────────────────────────────────────────────────
    //

        function prettyPrintResults ( results: Results ) {
            const resultsInLaTeX =
                Object.keys( results ).map( key =>
                    results[ key ]
                        ? `${ key } & = ${ results[ key ]}`
                        : null )
                    .join('\n\\\\[5pt]\n')

            const fullLaTeX =
                `\\begin{aligned}\n${ resultsInLaTeX }\n\\end{aligned}`

            renderLaTeX( "results", fullLaTeX )
        }

    //
    // ─── RENDER LATEX ───────────────────────────────────────────────────────────────
    //

        function renderDependencyLaTeX ( ast: AST ) {
            const compiledTeX =
                Workout.LaTeX.generateDiagram( ast )

            renderLaTeX( 'katex-display', compiledTeX )
        }

    //
    // ─── RENDER LATEX ───────────────────────────────────────────────────────────────
    //

        function renderLaTeX ( id: string, code: string ) {
            const katexDisplay =
                document.getElementById( id )!
            katexDisplay.innerHTML =
                katex.renderToString( code, { displayMode: true } );
        }

    // ────────────────────────────────────────────────────────────────────────────────

}