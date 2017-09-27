
//
// Copyright 2017 by Pouya Kary. All Rights Reserved
//

declare namespace Springy {

    //
    // ─── INTERFACES ─────────────────────────────────────────────────────────────────
    //

        export interface IGraphNewNodeOptions {
            label?: string
        }

        export interface IGraphNewEdgeOptions {
            color?: string
        }

        export interface IGraphJSONInput {
            nodes: string[ ]
            edges: string[ ][ ]
        }

    //
    // ─── NODE OBJECT ────────────────────────────────────────────────────────────────
    //

        class Node {
            // currently nothing
        }

    //
    // ─── GRAPH CLASS ────────────────────────────────────────────────────────────────
    //

        export class Graph {

            newNode ( options: IGraphNewNodeOptions ): Node

            addNodes( ...nodeNames: string[ ] ): void

            newEdge ( start: Node, end: Node, options?: IGraphNewEdgeOptions ): void

            addEdges( ...edges: string[ ][ ] ): void

            loadJSON( jsonInput: IGraphJSONInput ): void

        }

    // ────────────────────────────────────────────────────────────────────────────────

}
