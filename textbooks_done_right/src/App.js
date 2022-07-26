import './App.css';
import parse from 'html-react-parser';
//import htmlContent from './raw_book.html';
import book from "./raw_book.jsx";
import { useEffect } from 'react';


function App() {

    const bookParser = (book) => {

	let inBlue = false;
	let bIdx = -1;
	let blues = []


	const checkBlue = (obj) => {
	    if (obj.props && obj.props.className) {
		if (obj.props.className.includes("fca")) {
		    return "start"
		}

		else if (obj.props.className.includes("fc7") || obj.props.className.includes("x9")) {
		    return "end"
		}
	    }
	}

	let recursionDepth =  0;
	let prev = null

	const isObj = (el) => (
	    typeof el === 'object' &&
	    !Array.isArray(el) &&
	    el !== null
	)

	const search = (obj) => {

	    let localBlue = checkBlue(obj);

            if (localBlue === "start") {
		inBlue = true;
		bIdx++;
		blues.push([])
	    }

	    if (localBlue === "end") {
		inBlue = false
	    }

	    if (inBlue) {
		blues[bIdx].push(obj)
	    }

	    if (obj.props && obj.props.children) {
		if (isObj(obj.props.children)) {
		    search(obj.props.children)
		} else {
		    for (const i of obj.props.children) {
			search(i)
		    }
		}
	    }

	    /*
	    console.log("we are searching!", obj)
    	    if (recursionDepth < 100) {
		recursionDepth++

		if (obj.props && obj.props.children) {

		    if (isObj(obj.props.children)) {
			console.log(obj, "it's an object")
			console.log("we are passing", obj.props.children, "obj!")
			search(obj.props.children)
		    } else {
			console.log("it's not an object..")
			for (const i of obj.props.children) {
			    console.log(obj, "it's an el in an arr?")
			    console.log("we are passing", obj.props.children)
			    search(i)
			}
		    }
		    prev = obj
		} else {
		    console.log("no children", obj, recursionDepth, prev)
		}

	    } else {
		console.log("recursionDepth exceeded")
	    }
	    */
	}
	//search(
	//const pages = book.props.children[1].props.children[3].props.children;

	search(book)

	console.log(blues)

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
