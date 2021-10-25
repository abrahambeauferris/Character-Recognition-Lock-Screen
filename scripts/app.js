$(document).ready(function(){

    // Get the initial prompt for the user
    let char_gen = new CharacterGenerator();
    var user_prompt = promptUser(char_gen);
    
    // Create Canvas and set options
    var canvas = new handwriting.Canvas(document.getElementById("canvas"));
    canvas.setLineWidth(15);
    canvas.setOptions(
        {
            language: "ja",
            numOfReturn: 1
        }
    );

    /* Set callback function for canvas.recognize. This function is called after the response from Google's API endpoint is complete 
    and throws errors if any occur.
    This function will perform the check between the user's input and the prompt
    */
    canvas.setCallBack(function(data, err) {
        if(err) throw err;
        else{
            const prompt_char = user_prompt["char"][Object.keys(user_prompt["char"])[0]]; // this is nasty
            const written_char = data[0];

            console.log("Prompted:" + prompt_char);
            console.log("Written:" + written_char);

            if (prompt_char == written_char){
                console.log("Result: Correct");
                // Unlock
            } else {
                console.log("Result: Incorrect");
                canvas.erase();
                user_prompt = promptUser(char_gen);
            }
        }
    });


    // Simple submit button event - recognize user input and get a new user prompt
    $("#submit-button").mousedown(function(e){
           /* NOTE: you can only really call this here since it is async. Any susbsequent calls here may not have the updated state from the recognize callback.
            Try to put all program logic requiring the global state within the callback instead of in here */
           canvas.recognize();
        }
    );

    // Simple reset button event - erase canvas and get a new user prompt
    $("#reset-button").mousedown(function(e){
            canvas.erase();
            user_prompt = promptUser(char_gen);
        }
    );


    // Updates the user facing promp DOM element with a new random prompt depending on the language config
    function promptUser(generator){

        const hira = $("#hira-selector").prop('checked');
        const kata = $("#kata-selector").prop('checked');
        const tenten = $("#tenten-selector").prop('checked');

        generator.updateIncludeAlphas(hira, kata, tenten);
        const prompt = generator.generate();

        $("#prompt").text("Write " + prompt["alpha"] +  " \"" + Object.keys( prompt["char"])[0] + "\"")
        return prompt;
    }
});