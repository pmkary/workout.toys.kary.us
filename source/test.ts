
//
// Copyright 2017 by Pouya Kary. All Rights Reserved
//   This code is property of Pouya Kary and is in no way granted
//   to be used by anyone else in anyways.
//

/// <reference path="core/index.ts" />
/// <reference path="core/latex.ts" />


namespace TestWorkspace {

    //
    // ─── TESTING ────────────────────────────────────────────────────────────────────
    //

        window.onload = ( ) => {
            const code = (`
                a = 2
                y = x + 2
                x = 3 * a
                z = y + w
            `)

            const computed = Workout.compute( code )

            const latexCode = Workout.LaTeX.generateDiagram( computed.ast )

            console.log( latexCode )

            console.log( computed )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}