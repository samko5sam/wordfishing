// questionBanks.js

export const bank1 = [
    {
        title: "One Colorful Reference",
        quip: "I swear to god, I still vaguely remember a question about Shane Van Boening and \"blue balls\" in a YDKJ game.\nNot sure which version it's from though, only remembered that it's a modern one.\nCan't even seem to find the source as well.\n Anyways, riddle me this.",
        question: "Given the context of \"Shane Van Boening\" and \"blue balls\", which equation wouldn't make sense?",
        answers: ["3+6=7", "2+1=6", "4+2=7", "1+3=5"],
        correctAnswer: "4+2=7",
        incorrectMessages: {
          '3+6=7': "That's the color of what's spewing from your mouth.❌",
          '2+1=6': "...You disgust me.❌",
          '1+3=5': "Orange you glad you picked this? Of course not.❌"
        },
        explanation: "The 4 ball is usually purple, and the 2 ball is blue in billiards. Mix the colors together, and you'll get something similar to violet, and not the brown of the 7 ball."
      },
      {
        title: "Making Sports Literal",
        quip: "If there's something that I find odd, it's that there's not enough bowls in bowling.\nSo...",
        question: "If I were to take 2 mixing bowls to make a makeshift bowling ball, what size, in diameter, would work the best?",
        answers: ["18 cm", "24 cm", "20 cm", "22 cm"],
        correctAnswer: "22 cm",
        incorrectMessages: {
          "18 cm": "Them hands aren't catching this ball.❌",
          "24 cm": "Why don't you pick up a basket, while you're at it?❌",
          "20 cm": "I think a spike is enough to break the bowls, so...❌"
        },
        explanation: "A bowling ball is around 21.83 cm in diameter, so 22 cm would be the best fit."
      }
      // Add more questions in the same format
];

export const bank2 = [
  {
    title: "On Capitals",
    quip: "This is for those who want to learn countries.",
    question: "What is the capital of France?",
    answers: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
    incorrectMessages: {
      Berlin: "Berlin is the capital of Germany.❌",
      Madrid: "Madrid is the capital of Spain.❌",
      Rome: "Rome is the capital of Italy.❌"
    },
    explanation: "Paris is known for its art, fashion, and the Eiffel Tower."
  }, 
  {
    title: "Astronomy",
    quip: "Time to learn some planets.",
    question: "What is the largest planet in our Solar System?",
    answers: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Jupiter",
    incorrectMessages: {
      Earth: "Earth is the third planet from the Sun.❌",
      Mars: "Mars is the fourth planet.❌",
      Venus: "Venus is close to Earth but smaller.❌"
    },
    explanation: "Jupiter is the largest planet in our Solar System."
  },
  // More questions in bank2
];

// Add as many banks as you like or include a mix of questions in allBanks
export const allBanks = [...bank1, ...bank2];
