
//
// Copyright 2017 by Pouya Kary. All Rights Reserved
//   This code is property of Pouya Kary and is in no way granted
//   to be used by anyone else in anyways.
//

/// <reference path="typings/jsep.d.ts" />


namespace Workout.Parser {

    //
    // ─── PARSE ──────────────────────────────────────────────────────────────────────
    //

        /** parses the code into Workout AST */
        export function parse ( code: string ) {
            // get lines
            const lines =
                code.split('\n')
                    .filter( line => !/^\s*$/.test( line ) )


            // check if lines are okay
            for ( const line of lines ) {
                const splinted = line.split('=')
                if ( splinted.length !== 2 )
                    throw { line: line, message: "Has more than one definition sign" }

                if ( !/^[a-z]$/.test( splinted[ 0 ].trim( ) ) )
                    throw { line: line, message: "Bad formula symbol" }
            }


            // compiling formulas
            const formulas =
                lines.map( line => {
                    const [ name, rule ] = line.split('=')
                    return {
                        symbol:     name.trim( ),
                        formula:    jsep( rule )
                    }
                })


            // done
            return formulas
        }

    // ────────────────────────────────────────────────────────────────────────────────

}