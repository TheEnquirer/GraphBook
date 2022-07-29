import './App.css';
import parse from 'html-react-parser';
//import htmlContent from './raw_book.html';
import book from "./raw_book.jsx";
import { useEffect, useState } from 'react';
import reactHtmlReplace from 'react-html-replace';
import React, { Component } from 'react';
import _ from 'lodash';
import * as ReactDOM from 'react-dom'
import { Virtuoso } from 'react-virtuoso'


function App() {

    const bookParser = (book) => {
	// UTILS //
	const isObj = (el) => (
	    typeof el === 'object' &&
	    !Array.isArray(el) &&
	    el !== null
	)

	// CHECKS //

         // BLUE //
	let inBlue = false;
	let bIdx = -1;
	let blues = []
	const checkBlue = (obj) => {
	    let localVal = null;
	    if (obj.props && obj.props.className) {
		if (obj.props.className.split(" ").includes("fca") && inBlue == false) {
		    localVal = "start"
		}

		else if (
		    obj.props.className.split(" ").includes("fc7")
		    || obj.props.className.split(" ").includes("x9")
		    || obj.props.className.split(" ").includes("x69")
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


    	// MAIN RECURSION LOOP //
	const search = (obj) => {

	    checkBlue(obj);
	    checkDef(obj);

	    // recurse
	    if (obj.props && obj.props.children) {
		if (isObj(obj.props.children)) {
		    search(obj.props.children)
		} else {
		    //if (obj.props.children.push) obj.props.children.push("huh?")
		    for (const i of obj.props.children) {
			search(i)
		    }
		}
	    }
	}

	search(book)
	//console.log(blues)
	//console.log(
	//props.children[1].props.children[3].props.children

	return book
	//NW TODO: we append the page svgs
    }

    const [foundBlues, setBlues] = useState([]);
    const [displayParsed, setParsed] = useState("");

    const reconstruct = (book) => {
	return _.cloneDeep(book)
	//return book
    }

    useEffect(() => {
	let parsed = reconstruct(parse(book))
	setParsed(bookParser(parsed))
    }, [])

	    //{foundBlues.map((blue, idx) => {
	    //    return blue.map((el, idx) => {
	    //        return el
	    //    })}
	    //)}

    return (
	<>
	      {/*return <Virtuoso
    style={{ height: "400px", }}
    totalCount={200000}
    itemContent={(index) => <div>Item {index}</div>}
  />*/}
	    {displayParsed}
	</>
    );
}

export default App;
