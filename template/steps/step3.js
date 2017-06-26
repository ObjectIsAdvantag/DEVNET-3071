//
// coffee: example of a conversation with yes/no options
//
// "What about coffee (yes / no / cancel)"
//
module.exports = function (controller) {

    controller.hears(['start'], 'direct_message,direct_mention', function (bot, message) {

        bot.createConversation(message, function (err, convo) {

            // Default thread
            convo.ask("Ready for a challenge (yes/no/cancel)", [
                {
                    pattern: "yes|yeh|sure|oui|si",
                    callback: function (response, convo) {
                        convo.gotoThread('quiz');
                    },
                }
                , {
                    pattern: "no|neh|non|na|birk",
                    callback: function (response, convo) {
                        convo.say("Too bad, looking forward to play with you later...");
                        convo.next();
                    },
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.gotoThread('cancel');
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);

            // Cancel thread
            convo.addMessage({
                text: "Got it, cancelling...",
                action: 'stop', // this marks the converation as unsuccessful
            }, 'cancel');
            
            // Quiz thread
            convo.addMessage("Let's start", "quiz");

            convo.addQuestion("Question: 5x5=", [
                {
                    pattern: "^25$",
                    callback: function (response, convo) {
                        convo.gotoThread('success');
                    },
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.gotoThread('cancel');
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("Sorry, wrong answer. Try again!");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], {}, 'quiz');

            // Succes thread
            convo.addMessage("Congrats, you did it!", "success");

            convo.activate();
        });
    });
};