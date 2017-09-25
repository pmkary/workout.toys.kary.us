
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

            inputBox.onchange = onInputChange
            inputBox.oninput = onInputChange
            inputBox.onkeyup = onInputChange
        }

    //
    // ─── LOAD IF TEXT IS IN LOCAL STORAGE ───────────────────────────────────────────
    //

        function checkAndLoadCodeInLocalStorage ( ) {
            const code =
                localStorage.getItem( localStorageId )
            if ( code )
                ( document.getElementById('code-input') as HTMLTextAreaElement )!
                    .value = code
        }

    //
    // ─── ON CHANGE ──────────────────────────────────────────────────────────────────
    //

        export function onInputChange ( ) {
            try {
                const input =
                    ( document.getElementById('code-input') as HTMLTextAreaElement )!
                    .value

                const computedResults =
                    Workout.compute( input )

                renderLaTeX( computedResults.ast )
                prettyPrintResults( computedResults.results )

                localStorage.setItem( localStorageId, input )

            } catch {

            }
        }

    //
    // ─── PRETTY PRINT RESULTS ───────────────────────────────────────────────────────
    //

        function prettyPrintResults ( results: Results ) {
            document.getElementById('results')!.innerHTML =
                Object.keys( results ).map( key =>
                    results[ key ]
                        ? `<b>${ key }</b> &rightarrow; <b>${ results[ key ]}</b>`
                        : null )
                    .join('<br/>')
        }

    //
    // ─── RENDER LATEX ───────────────────────────────────────────────────────────────
    //

        function renderLaTeX ( ast: AST ) {
            const katexDisplay =
                document.getElementById('katex-display')!
            const compiledTeX =
                Workout.LaTeX.generateDiagram( ast )

            console.log( compiledTeX )

            katexDisplay.innerHTML =
                katex.renderToString( compiledTeX, { displayMode: true } );
        }

    // ────────────────────────────────────────────────────────────────────────────────

}