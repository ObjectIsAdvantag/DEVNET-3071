//
// coffee: example of a conversation with yes/no options
//
// "What about coffee (yes / no / cancel)"
//
module.exports = function (controller) {

    controller.hears(['quiz'], 'direct_message,direct_mention', function (bot, message) {

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
            convo.addMessage({
                text: "Let's start",
            }, 'quiz');

            convo.activate();
        });
    });
};
