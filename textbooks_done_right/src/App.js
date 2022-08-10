import './App.css';
import parse from 'html-react-parser';
//import htmlContent from './raw_book.html';
import book from "./raw_book.jsx";
import { useEffect, useState, createElement, useRef } from 'react';
import reactHtmlReplace from 'react-html-replace';
import React, { Component, useMemo } from 'react';
import _ from 'lodash';
import * as ReactDOM from 'react-dom'
import { Virtuoso } from 'react-virtuoso'
import { List } from 'immutable';

//import { TWELVE, DummyAhoLinker } from 'jentity_linker';

// hewwwuxxxxxxxxxxxx heres an example of how to use my thingy
/*
function TextWithHovers({ text }) {
    const definitions = {
        '12': TWELVE,
        'complex': "a complex number.", // you could also use Symbols here and have your own jsx object stored elsewhere as the definition
        'complex conjugate': "a unary operation that negates the complex component of a complex number."
    };

    const parser = useMemo(() => {
        const linker = new DummyAhoLinker();
        linker.register_definitions(Object.entries(definitions));
        return linker.find_links.bind(linker);
    }, [definitions]);
    // parser.find_links(text) -> immutable.List([ [beg_idx_inc, end_idx_exc, '12', 'twelve.'], etc ])
    // find_links is as fast as i can think to make it, roughly linear on text.length + sum(definitions.keys().map(length)) possibly still worth useMemo though

    const parsed = useMemo(() => parser(text), [text]);
    // get the boundaries of the definitions. this will be flattened later
    const end_indicies = parsed.map(([b, e, n, d]) => List([b, e])).push(text.length);
    // the boundaries but with a 0 at the start. when we zip this with end_indicies, one will list will be offset -> you get each span
    const beg_indicies = end_indicies.unshift(0);    // might need to .delete() but thats O(N) => cringe

    const sections = parsed.map(seg => List([null, seg])).push(null).flatten(0)   // intersperse with nulls for the non-highlighted sections
        .zip(beg_indicies.toJS().flat(), end_indicies.toJS().flat())
        .map(([hover, beg, end], i) => {
            if (hover === null) {   // no definition
                return <span key={i}>{text.slice(beg, end)}</span>
            } else {                // theres a definition
                return <a key={i} style={{ color: '#338833' }} onClick={() => { alert(hover[3]) }}>{text.slice(beg, end)}</a>
            }
        })
        .toJS();

    return sections;

    // sorry if that example wasn't very helpful. i just got in a functional kinda headspace yk
    // the zip offset thing is pretty scuffed i'll admit
    // also the returned segments can overlap, so my example just kinda duplicates the overlapped text. idk how u wanna deal with that
    // the overlap can occur because if you have "real number" and "number equals" in the dictionary, then they might be the same length and it's not clear which one should get a hover. so this example would just spit out <span onHover>real number</span><span onHover>number equals</span>
}

function App() {
    console.log('twelve?', TWELVE);

    return <TextWithHovers text={ `Every real number equals its complex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugate. Anyways, complex numbers are cool right?` } />
    */

function App() {

    const curBlueRef = useRef();
    const testRef = useRef();

    const bookParser = (book) => {  // nice -alb
        // UTILS //
        const isObj = (el) => (
            typeof el === 'object' &&
            !Array.isArray(el) &&
            el !== null
        )

	const appendToChildren = (obj, el) => {
	    if (!obj.props || obj.props.children == undefined) {
		//console.log('no children!')
		//obj = React.createElement(
		//    "span",
		//    obj.props,
		//    [obj, el]
		//)
		return
	    }

	    if (isObj(obj.props.children)) {
		obj.props.children = [ obj.props.children, el ]
		return
	    }

	    if (Array.isArray(obj.props.children)) {
		obj.props.children.push(el)
		return
	    }
	}


	//const stringToSpan

        // CHECKS //

        // BLUE //
        let inBlue = false;
        let bIdx = -1;
        let blues = []
	let blueEndIdxs = []
        const checkBlue = (obj) => {
            let localVal = null;
            if (obj.className) {
                if (obj.className.split(" ").includes("fca") && inBlue == false) {
                    localVal = "start"
                }

                else if (
                    obj.className.split(" ").includes("fc7")
                    || obj.className.split(" ").includes("x9")
                    || obj.className.split(" ").includes("x69")
                ) {
                    localVal = "end"
                }
            }

            if (localVal === "start") {
                inBlue = true;
                bIdx++;
                blues.push([])
            }

            if (localVal === "end") {
                inBlue = false
	    }


            if (inBlue) {
                blues[bIdx].push(obj)
            }

            return localVal
        }

	/*
        let defIdx = -1;
        let defs = []
        let inDef = false;

        const checkDef = (obj) => {
            let localVal = null;
            if (obj.props && obj.props.className) {
                if (obj.props.className.split(" ").includes("fc9")) {
                    localVal = "start"
                }

                else if (obj.props.className.split(" ").includes("x4") || obj.props.className.split(" ").includes("x9")  || obj.props.className.split(" ").includes("x69")) {
                    localVal = "end"
                }
            }

            if (localVal === "start") {
                inDef = true;
                defIdx++;
                defs.push([])
            }

            if (localVal === "end") {
                inDef = false
            }

            if (inDef) {
                defs[defIdx].push(obj)
            }
        }
	*/

    	let max_recur = 1000
	let recur = 0;

        // MAIN RECURSION LOOP //   // :eyes: -alb
        const search = (obj) => {
	    //recur += 1
	    //if (recur > max_recur) { console.log('max recur achieved'); return }

	    checkBlue(obj)

	    //if (obj.props) {
	    //    console.log(obj, "i got props bro")
	    //}
	    // can be either props.children or children
	    // children can be either an arr of children of just a single object
	    // or, null

	    //console.log(obj.className)

	    if (obj.children) {
		for (const child of obj.children) {
		    search(child)
		}
	    } else if (obj.props.childen) {
		console.log("hii we have props childen", obj)
	    }

	    //###################################################################//

            //checkBlue(obj);
            // checkDef(obj);

            // recurse
	/*
            if (obj.props && obj.children) {
                if (isObj(obj.children)) {
                    //obj = _.clone(obj)
		    //obj.ref = curBlueRef
		    //obj.props.children = [obj.props.children]
		    search(obj.children)
                }
		//console.log(obj.props.children)
		if (Array.isArray(obj.children)) {
		    //let tempChildren = _.cloneDeep(obj.props.children)
			//.map(item => <div style={{minHeight: "1px"}}>{item}</div>) // we don't need this
		    //obj.props.children.splice(0, tempChildren.length)
		    //obj.props.children.concat(tempChildren.map(item => <div style={{minHeight: "1px"}}>{item}</div>))
		    //obj = _.cloneDeepWith(obj, customC)
		    for (const [i,v] of obj.children.entries()) {
			search(v)
		    }
		}
            }
	*/
        }

        //let repChildren = book.props.children[1].props.children[3].props.children

        search(book)
	//console.log(blues)
	//book.props.children[1].props.children.props.children[3].props.children = [<Virtuoso
/*
	book.props.children[1].props.children[3].props.children = [<Virtuoso
	    style={{ height: "100vh", }}
	    totalCount={repChildren.length}
	    //itemContent={(index) => <div>Item {index}</div>}
	    itemContent={(index) => {
		return repChildren[index]
	    }}
	    />]
	    */

        return {
	    book: book,
	    blues: blues,
	}
        //NW TODO: we append the page svgs
    }

    const [foundBlues, setBlues] = useState([]);
    const [displayParsed, setParsed] = useState("");
    const [nextRender, triggerNextRender] = useState(0);

    const reconstruct = (book) => {
        return _.cloneDeep(book)
    }

    useEffect(() => {
        let parsed = reconstruct(parse(book))
        //setParsed(bookParser(parsed))
        setParsed(parsed)
    }, [])


    useEffect(() => {
	//console.log("triggering a displayParsed change", displayParsed)
	//console.log(curBlueRef.current?.children, "waiiiit a second")

	if (curBlueRef.current) {
	    for (const el of curBlueRef.current.children) {
		//console.log(el.children[1].children[0].getBoundingClientRect(), "ayyyyup?")
		//console.log(curBlueRef.current.children[0].children[1].children[1].children[300].getBoundingClientRect(), "yeah")
		let bookData = bookParser(curBlueRef.current.children[0].children[1].children[1]);
		console.log(bookData.blues)
	    }
	}
    }, [displayParsed])



    return (
        <>
        {/*return <Virtuoso
    style={{ height: "400px", }}
    totalCount={200000}
    itemContent={(index) => <div>Item {index}</div>}
  />*/}
	    <div ref={curBlueRef}> {displayParsed} </div>
        </>
    );
}

export default App;
