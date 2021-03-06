/*
draw image: http://stackoverflow.com/questions/22255580/javascript-upload-image-file-and-draw-it-into-a-canvas
draw text: http://stackoverflow.com/questions/3697615/how-can-i-write-text-on-a-html5-canvas-element
resize image before drawing: http://stackoverflow.com/questions/10333971/html5-pre-resize-images-before-uploading
download canvas as image: http://jsfiddle.net/AbdiasSoftware/7PRNN/
*/

// KEY PROPERTIES OF THE CANVAS ELEMENTS
var canvas_properties = {
    background_image: '',
    background_image_input: document.getElementById("background_image"),
    canvas: document.getElementById("canvas"),
    canvas_height: '',
    canvas_width: '',
    context: this.canvas.getContext("2d"),
    logo_image: 'assets/img/logo_banner_only.jpg',
    logo_html_image: '',
    logo_x: 0,
    logo_y: '',
    logo_height: '',
    logo_width: '',
    max_height: 600,
    max_width: 600,
    text: '',
    text_fillStyle: '#ffffff',
    text_font_family: 'Hero',
    text_font_size: 40,
    text_line_height: '',
    text_max_width: '',
    text_x: 0,
    text_y: 40,
}

// ARRAY OF INPUTS TO CHANGE CANVAS PROPERTIES
var canvas_inputs = [
    {
        row_id: 'quote_text',
        label: 'Write your quote',
        inputs: [
            {
                tag: 'textarea',
                type: '',
                label: '',
                event: 'onkeyup',
                canvas_property: 'text',
                value: canvas_properties.text,
            }
        ]
    },
    {
        row_id: 'quote_styles',
        label: 'Style your quote',
        inputs: [
            {
                tag: 'input',
                type: 'number',
                label: 'Horizontal position',
                event: 'onchange',
                canvas_property: 'text_x',
                value: canvas_properties.text_x,
            },
            {
                tag: 'input',
                type: 'number',
                label: 'Vertical position',
                event: 'onchange',
                canvas_property: 'text_y',
                value: canvas_properties.text_y,
            },
            {
                tag: 'input',
                type: 'number',
                label: 'Font size',
                event: 'onchange',
                canvas_property: 'text_font_size',
                value: canvas_properties.text_font_size,
            },
            {
                tag: 'input',
                type: 'number',
                label: 'Text width',
                event: 'onchange',
                canvas_property: 'text_max_width',
                value: '',
            },
            {
                tag: 'input',
                type: 'color',
                label: 'Font color',
                event: 'onchange',
                canvas_property: 'text_fillStyle',
                value: canvas_properties.text_fillStyle,
            }
        ]
    },
]

function getBackgroundImage() {
    // IF A FILE EXISTS
    if ( canvas_properties.background_image_input.files && canvas_properties.background_image_input.files[0] ) {
        // INIT READER
        var reader = new FileReader();
        // WHEN READER READY ...
        reader.onload = function(e) {
            // INIT BACKGROUND IMAGE AS IMAGE
            canvas_properties.background_image = new Image();
            canvas_properties.background_image.onload = function() {
                // GET IMAGE HEIGHT AND WIDTH
                var image_height = canvas_properties.background_image.height;
                var image_width = canvas_properties.background_image.width;
                // IF IMAGE IS HORIZONTAL
                if (image_width > image_height) {
                    image_ratio = image_height/image_width;
                    canvas_properties.canvas_width = canvas_properties.max_width;
                    canvas_properties.canvas_height = canvas_properties.canvas_width * image_ratio;
                // OR, IF IMAGE IS VERTICAL
                } else if (image_width < image_height) {
                    image_ratio = image_width/image_height;
                    canvas_properties.canvas_height = canvas_properties.max_height;
                    canvas_properties.canvas_width = canvas_properties.canvas_height * image_ratio;
                }
                // SET TEXT MAX WIDTH
                canvas_properties.text_max_width = canvas_properties.canvas_width / 2;
                // SEND THAT MAX WIDTH CALCULATION TO MAX WIDTH INPUT
                canvas_inputs[1].inputs[3].value = Math.round(canvas_properties.canvas_width / 2);
                // SET CANVAS HEIGHT AND WIDTH
                canvas_properties.canvas.width = canvas_properties.canvas_width;
                canvas_properties.canvas.height = canvas_properties.canvas_height;
                // DRAW THE IMAGE ON THE CANVAS
                drawFullCanvas();
                // OUTPUT INPUTS
                outputInputs();
            };
            // GET BACKGROUND IMAGE SOURCE
            canvas_properties.background_image.src = e.target.result;
        };       
        reader.readAsDataURL(canvas_properties.background_image_input.files[0]);
    }
}

function clearCanvas() {
    canvas_properties.context.clearRect(0, 0, canvas_properties.canvas_width, canvas_properties.canvas_height);
}

function drawFullCanvas() {
    clearCanvas();
    drawBackgroundImage();
    drawQuoteText();
    drawLogo();
}

function drawBackgroundImage() {
    canvas_properties.context.drawImage(canvas_properties.background_image, 0, 0, canvas_properties.canvas_width, canvas_properties.canvas_height);
}

function drawQuoteText() {
    // SET FONT SIZE AND FONT FAMILY
    canvas_properties.context.font = canvas_properties.text_font_size+"px "+canvas_properties.text_font_family;
    // SET FONT COLOR
    canvas_properties.context.fillStyle = canvas_properties.text_fillStyle;
    // SPLIT TEXT INTO WORDS BY SPACES
    var words = canvas_properties.text.toUpperCase().split(" ");
    // THIS VARIABLE WILL HOLD TEXT FOR THE CURRENT LINE
    var this_line = '';
    // THIS VARIABLE WILL HOLD THE CURRENT Y VALUE
    // INIT WIT THE CURRENT line_y FROM CANVAS PROPERTIES
    var this_line_y = canvas_properties.text_y;
    // LOOP THROUGH THE WORDS
    for (var i=0; i<words.length; i++) {
        // ADD THE CURRENT WORD TO THE CURRENT LINE TO TEST ITS LENGTH
        var test_line = this_line + words[i]+" ";
        // IF THE TEST LINE IS SHORTER THAN THE TEXT MAX WIDTH, ADD IT FOR GOOD
        if (canvas_properties.context.measureText(test_line).width < canvas_properties.text_max_width) {
            this_line = this_line += words[i]+" ";
        // OR, IF THE TEST LINE IS LONGER THAN THE MAX WIDTH, CREATE A NEW LINE AND RESET THE Y VALUE
        } else {
            this_line = words[i]+" ";
            this_line_y = Number(this_line_y)+Number(canvas_properties.text_font_size);
        }
        // DRAW THIS LINE ON THE PAGE
        canvas_properties.context.fillText(this_line, canvas_properties.text_x, this_line_y, canvas_properties.text_max_width);
    }

}

function drawLogo() {
    // INIT NEW IMAGE
    var new_logo_image = new Image();
    // SET IMAGE SRC FROM LOGO FILE PATH
    new_logo_image.src = canvas_properties.logo_image;
    // ONCE IMAGE LOADS
    new_logo_image.onload = function() {
        // SET THE LOGO IMAGE PROPERTY FOR USE IN DRAWING ON THE PAGE
        canvas_properties.logo_html_image = new_logo_image;
        // GET LOGO WIDTH
        var width = new_logo_image.width;
        // GET LOGO HEIGHT
        var height = new_logo_image.height;
        // GET LOGO PROPORTION
        var logo_proportion = width/height;
        // SET THE LOGO WIDTH TO HALF OF THE CANVAS
        canvas_properties.logo_width = canvas_properties.canvas_width/2;
        // SET THE LOGO HEIGHT TO KEEP THE PROPORTION
        canvas_properties.logo_height = canvas_properties.logo_width/logo_proportion;
        // SET THE Y VALUE FOR THE LOGO SO IT IS THE HEIGHT OF THE CANVAS MINUS THE LOGO HEIGHT
        canvas_properties.logo_y = canvas_properties.canvas_height-canvas_properties.logo_height;
        // DRAW THE LOGO IMAGE
        canvas_properties.context.drawImage(canvas_properties.logo_html_image, canvas_properties.logo_x, canvas_properties.logo_y, canvas_properties.logo_width, canvas_properties.logo_height);
    }; 
}

function downloadImage(el) {
    el.href = document.getElementById("canvas").toDataURL();
    el.download = 'iamdayton.png';
}

function changeProperty(property, new_value) {
    canvas_properties[property] = new_value;
    drawFullCanvas();
}

function outputInputs() {
    var data = {};
    data.inputs = canvas_inputs;
    $.get('hbs/inputs_template.hbs')
        .done(function(template) {
            template = Handlebars.compile(template);
            $("#inputs_container").html(template(data));
        });
}