
//
// Copyright 2017 by Pouya Kary. All Rights Reserved
//   This code is property of Pouya Kary and is in no way granted
//   to be used by anyone else in anyways.
//


namespace Workout.Parser {

    //
    // ─── INTERFACES ─────────────────────────────────────────────────────────────────
    //

        export interface IFormulaNode {
            dependencies:   string[ ]
            formula:        string
            symbol:         string
        }

    //
    // ─── PARSE ──────────────────────────────────────────────────────────────────────
    //

        /** parses the code into Workout AST */
        export function parse ( code: string ): IFormulaNode[ ] {
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
                        dependencies:   fetchSymbols( rule ),
                        formula:        rule.trim( ),
                        symbol:         name.trim( ),
                    }
                })


            // done
            return formulas
        }

    //
    // ─── GET SYMBOLS ────────────────────────────────────────────────────────────────
    //

        function fetchSymbols ( rule: string ) {
            // orchestras/symbols.orchestras
            const matches = new Array<string>( )
            rule.replace( /(?:\b((?:[a-z])+)\b)(?!(?:\s)*\()/g, match => {
                matches.push( match )
                return ''
            })
            return matches
        }

    // ────────────────────────────────────────────────────────────────────────────────

}