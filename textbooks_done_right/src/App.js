import './App.css';
import parse from 'html-react-parser';
//import htmlContent from './raw_book.html';
import book from "./raw_book.jsx";
import { useEffect } from 'react';


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
		if (obj.props.className.includes("fca")) {
		    localVal = "start"
		}

		else if (obj.props.className.includes("fc7") || obj.props.className.includes("x9")) {
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
	}

	let defIdx = -1;
	let defs = []
	let inDef = false;

	const checkDef = (obj) => {
	    let localVal = null;
	    if (obj.props && obj.props.className) {
		if (obj.props.className.includes("fc9")) {
		    localVal = "start"
		}

		else if (obj.props.className.includes("x4") || obj.props.className.includes("x9")) {
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
		    for (const i of obj.props.children) {
			search(i)
		    }
		}
	    }
	}

	search(book)

	console.log(blues, "\n", defs)
    }

    useEffect(() => {
	let parsed = parse(book)
	console.dir(parsed)
	bookParser(parsed)
    }, [])


    return (
	<>
	    {/*{parsed}*/}
	</>
    );
}

export default App;
