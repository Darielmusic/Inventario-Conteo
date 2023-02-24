let optionsMiddle = {
     height: "5.5in",
     width: "8.5in",
     orientation: "landscape",
     border: "1mm"
     // header: {
     //     // height: "45mm",
     //     // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
     // },
     // footer: {
     //     height: "28mm",
     //     contents: {
     //         first: 'Cover page',
     //         2: 'Second page', // Any page number is working. 1-based index
     //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
     //         last: 'Last Page'
     //     }
     // }
};

let optionsLetter = {
    format: "letter",
    orientation: "portrait",
    border: "1mm"
}



module.exports = {
    optionsMiddle,
    optionsLetter
}

