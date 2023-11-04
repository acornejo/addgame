"use strict";
function getSwiperSelected(swiper) {
    const column = swiper.getElementsByTagName("ol")[0];
    const children = column.getElementsByTagName("li");
    const children_count = children.length;
    const children_height = column.scrollHeight / children_count;
    const selected_index = 1 + Math.round(column.scrollTop / children_height);
    return children[selected_index].innerText;
}
function setSwipperSelected(swiper, input) {
    const column = swiper.getElementsByTagName("ol")[0];
    const children = column.getElementsByTagName("li");
    children[0].scrollIntoView();
    if (input == null)
        return;
    Array.from(children).forEach((child) => {
        if (child.innerText == input) {
            child.scrollIntoView({ behavior: "instant", block: "center" });
        }
    });
}
function setElementText(elem, text) {
    while (elem.firstChild) {
        elem.removeChild(elem.lastChild);
    }
    elem.appendChild(document.createTextNode(text));
}
function renderResult(result, carry, value) {
    let text = formatNumberString(getResult(value));
    if (text.length == 3) {
        text = "," + text;
    }
    const reversedChildren = Array.from(result.children).reverse();
    const reversedText = text.split('').reverse();
    if (reversedText.length > reversedChildren.length) {
        console.log("result too long");
        return;
    }
    // Reset all children
    reversedChildren.forEach((elem) => {
        elem.className = "";
        elem.removeAttribute("data-index");
        setElementText(elem, "");
    });
    // Set child properties based on text chars
    let numIndex = 0;
    reversedText.forEach((char, index) => {
        let child = reversedChildren[index];
        if (IsNumber(char)) {
            child.className = "active";
            child.setAttribute("data-index", numIndex.toString());
            numIndex = numIndex + 1;
        }
        setElementText(child, char);
    });
    // Set last box as empty
    let lastChild = reversedChildren[reversedText.length];
    lastChild.className = "empty";
    lastChild.setAttribute("data-index", numIndex.toString());
    setElementText(lastChild, "\u00A0");
    setElementText(carry, formatCarry(getCarry(value)));
}
function IsNumber(text) {
    return parseInt(text).toString() == text;
}
function generateNumber(digits) {
    return Math.floor(Math.random() * Math.pow(10, digits));
}
function formatNumber(input) {
    return formatNumberString(input.toString());
}
// add comma every 3 digits
function formatNumberString(input) {
    return input.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}
// remove commas and zero's
function formatCarry(input) {
    return formatNumberString(input).replaceAll('0', '\xa0').replaceAll(',', '\xa0');
}
function getCarry(input) {
    let carry = input.map((num) => (Math.trunc(num / 10))).reverse();
    carry.push(0);
    return carry.join('');
}
function getResult(input) {
    let result = input.map((num) => (num % 10));
    return result.reverse().join('');
}
window.onload = function () {
    let swiper = document.getElementById("swiper");
    let swiperAccept = document.getElementById("swiper-accept");
    let swiperCancel = document.getElementById("swiper-cancel");
    let submitButton = document.getElementById("submit-button");
    let successStatus = document.getElementById("success-status");
    let failureStatus = document.getElementById("failure-status");
    let mathBox = document.getElementById("math-box");
    let op = document.getElementById("op");
    let carry = document.getElementById("carry");
    let arg1 = document.getElementById("arg1");
    let arg2 = document.getElementById("arg2");
    let result = document.getElementById("result");
    let score = document.getElementById("score");
    let result_value = [];
    let score_value = 0;
    setElementText(op, "+");
    const arg1_value = generateNumber(4);
    const arg2_value = generateNumber(4);
    setElementText(arg1, formatNumber(arg1_value));
    setElementText(arg2, formatNumber(arg2_value));
    renderResult(result, carry, result_value);
    Array.from(result.children).forEach((elem) => {
        elem.addEventListener("click", () => {
            if (!elem.hasAttribute("data-index")) {
                return;
            }
            swiper.style.display = 'flex';
            mathBox.style.display = 'none';
            const index = parseInt(elem.getAttribute("data-index"));
            if (index < result_value.length) {
                setSwipperSelected(swiper, result_value[index].toString());
            }
            else {
                setSwipperSelected(swiper, null);
            }
            swiperAccept.onclick = function () {
                const selected_value = getSwiperSelected(swiper);
                const selected_int = parseInt(selected_value);
                swiper.style.display = 'none';
                mathBox.style.display = 'block';
                // If not an integer, then truncate
                if (!IsNumber(selected_value)) {
                    result_value = result_value.slice(0, index);
                }
                else {
                    if (index >= result_value.length) {
                        result_value.push(selected_int);
                    }
                    else {
                        result_value[index] = selected_int;
                    }
                }
                renderResult(result, carry, result_value);
            };
        });
    });
    swiperAccept.onclick = function () {
        swiper.style.display = 'none';
        mathBox.style.display = 'block';
    };
    swiperCancel.onclick = function () {
        swiper.style.display = 'none';
        mathBox.style.display = 'block';
    };
    submitButton.onclick = function () {
        mathBox.style.display = 'none';
        if (arg1_value + arg2_value == parseInt(getResult(result_value))) {
            successStatus.style.display = 'block';
            score_value++;
            result_value.length = 0;
            renderResult(result, carry, result_value);
            setElementText(score, score_value.toString());
        }
        else {
            failureStatus.style.display = 'block';
        }
        setTimeout(function () {
            mathBox.style.display = 'block';
            successStatus.style.display = 'none';
            failureStatus.style.display = 'none';
        }, 2000);
    };
};
