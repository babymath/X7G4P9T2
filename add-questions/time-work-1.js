const questions = [
    {
        questionEnglish: "If 10 people can complete a work in 20 days, how many days will 5 people take to complete the same work?",
        questionHindi: "यदि 10 व्यक्ति किसी कार्य को 20 दिनों में पूरा कर सकते हैं, तो 5 व्यक्ति उसी कार्य को कितने दिनों में पूरा करेंगे?",
        options: ["30 दिन", "40 दिन", "50 दिन", "20 दिन", "10 दिन"],
        correctAnswer: "40 दिन"
    },
    {
        questionEnglish: "If A can complete a work in 10 days and B can complete the same work in 15 days, how many days will they take to complete the work together?",
        questionHindi: "यदि A किसी काम को 10 दिनों में और B उसी काम को 15 दिनों में पूरा कर सकता है, तो दोनों मिलकर काम कितने दिनों में पूरा करेंगे?",
        options: ["6 दिन", "7 दिन", "5 दिन", "8 दिन", "10 दिन"],
        correctAnswer: "6 दिन"
    },
    {
        questionEnglish: "A and B together can complete a work in 12 days. A alone can do the same work in 20 days. How many days will B take to complete the work alone?",
        questionHindi: "A और B मिलकर किसी कार्य को 12 दिनों में पूरा कर सकते हैं। A अकेला वही काम 20 दिनों में करता है। B अकेले वही काम कितने दिनों में करेगा?",
        options: ["30 दिन", "25 दिन", "15 दिन", "20 दिन", "10 दिन"],
        correctAnswer: "30 दिन"
    },
    {
        questionEnglish: "One tap can fill a tank in 6 hours, while another tap can empty the same tank in 9 hours. If both taps are opened together, how long will it take to fill the tank?",
        questionHindi: "एक नल किसी टंकी को 6 घंटे में भर सकता है, जबकि दूसरा नल उसी टंकी को 9 घंटे में खाली कर सकता है। यदि दोनों नल एक साथ खोले जाएं, तो टंकी कितने समय में भरेगी?",
        options: ["18 घंटे", "12 घंटे", "9 घंटे", "15 घंटे", "6 घंटे"],
        correctAnswer: "18 घंटे"
    },
    {
        questionEnglish: "If 6 workers can complete a work in 12 days, how many days will 8 workers take to complete the same work?",
        questionHindi: "यदि 6 मजदूर किसी काम को 12 दिनों में पूरा करते हैं, तो 8 मजदूर वही काम कितने दिनों में पूरा करेंगे?",
        options: ["9 दिन", "8 दिन", "10 दिन", "7 दिन", "6 दिन"],
        correctAnswer: "9 दिन"
    },
    {
        questionEnglish: "If A can complete a work in 8 days and B can do the same work in 16 days, how many days will they take to complete the work together?",
        questionHindi: "यदि A किसी काम को 8 दिनों में पूरा कर सकता है और B उसी काम को 16 दिनों में करता है, तो दोनों मिलकर कितने दिनों में कार्य पूरा करेंगे?",
        options: ["4 दिन", "5.33 दिन", "6 दिन", "8 दिन", "10 दिन"],
        correctAnswer: "5.33 दिन"
    },
    {
        questionEnglish: "If 15 workers can complete a work in 24 days, how many days will 10 workers take to complete the same work?",
        questionHindi: "यदि 15 मजदूर किसी कार्य को 24 दिनों में पूरा करते हैं, तो 10 मजदूर वही कार्य कितने दिनों में पूरा करेंगे?",
        options: ["30 दिन", "36 दिन", "20 दिन", "32 दिन", "40 दिन"],
        correctAnswer: "36 दिन"
    },
    {
        questionEnglish: "One tap can fill a tank in 10 hours, while another tap can empty the same tank in 15 hours. If both taps are opened together, how long will it take to fill the tank?",
        questionHindi: "एक नल किसी टंकी को 10 घंटे में भरता है, जबकि दूसरा नल उसी टंकी को 15 घंटे में खाली करता है। यदि दोनों एक साथ खोल दिए जाएं, तो टंकी कितने घंटे में भरेगी?",
        options: ["30 घंटे", "40 घंटे", "20 घंटे", "50 घंटे", "60 घंटे"],
        correctAnswer: "30 घंटे"
    },
    {
        questionEnglish: "One person can complete a work in 16 days and another person can complete the same work in 24 days. How many days will they take to complete the work together?",
        questionHindi: "एक व्यक्ति किसी कार्य को 16 दिनों में कर सकता है और दूसरा व्यक्ति उसी कार्य को 24 दिनों में पूरा कर सकता है। दोनों मिलकर कार्य कितने दिनों में पूरा करेंगे?",
        options: ["10 दिन", "12 दिन", "14 दिन", "8 दिन", "6 दिन"],
        correctAnswer: "9.6 दिन"
    },
    {
        questionEnglish: "Three persons A, B, and C can complete a work in 10, 20, and 30 days respectively. How many days will they take to complete the work together?",
        questionHindi: "तीन व्यक्ति A, B और C किसी कार्य को क्रमशः 10, 20 और 30 दिनों में पूरा कर सकते हैं। वे तीनों मिलकर कार्य कितने दिनों में पूरा करेंगे?",
        options: ["5 दिन", "6 दिन", "7 दिन", "8 दिन", "9 दिन"],
        correctAnswer: "5.45 दिन"
    },
    {
        questionEnglish: "If 12 persons can complete a work in 30 days, how many days will 18 persons take to complete the same work?",
        questionHindi: "12 व्यक्ति किसी कार्य को 30 दिनों में पूरा करते हैं, तो 18 व्यक्ति वही कार्य कितने दिनों में पूरा करेंगे?",
        options: ["15 दिन", "20 दिन", "25 दिन", "10 दिन", "18 दिन"],
        correctAnswer: "20 दिन"
    },
    {
        questionEnglish: "A can complete a work in 15 days, while B can do the same work in 10 days. If both work together, how many days will it take to complete the work?",
        questionHindi: "A किसी कार्य को 15 दिनों में पूरा कर सकता है, जबकि B अकेला वही कार्य 10 दिनों में कर सकता है। यदि दोनों मिलकर काम करें, तो कितने दिनों में कार्य पूरा होगा?",
        options: ["5 दिन", "6 दिन", "7 दिन", "8 दिन", "9 दिन"],
        correctAnswer: "6 दिन"
    },
    {
        questionEnglish: "Two taps can fill a tank in 12 hours and 18 hours respectively. How long will it take to fill the tank if both taps are opened together?",
        questionHindi: "दो नल किसी टंकी को क्रमशः 12 घंटे और 18 घंटे में भरते हैं। दोनों एक साथ खोलने पर टंकी कितने समय में भर जाएगी?",
        options: ["6 घंटे", "7 घंटे", "8 घंटे", "9 घंटे", "10 घंटे"],
        correctAnswer: "7.2 घंटे"
    },
    {
        questionEnglish: "If 4 workers can complete a work in 36 days, how many days will 6 workers take to complete the same work?",
        questionHindi: "यदि 4 मजदूर किसी कार्य को 36 दिनों में पूरा करते हैं, तो 6 मजदूर वही कार्य कितने दिनों में पूरा करेंगे?",
        options: ["18 दिन", "24 दिन", "30 दिन", "12 दिन", "20 दिन"],
        correctAnswer: "24 दिन"
    },
    {
        questionEnglish: "A can complete a work in 10 days and B can do the same work in 15 days. How many days will they take to complete the work together?",
        questionHindi: "एक आदमी अकेले किसी कार्य को 10 दिनों में करता है और दूसरा आदमी वही कार्य 15 दिनों में करता है। दोनों मिलकर कितने दिनों में कार्य पूरा करेंगे?",
        options: ["6 दिन", "7 दिन", "5 दिन", "8 दिन", "10 दिन"],
        correctAnswer: "6 दिन"
    },
    {
        questionEnglish: "16. One tap can fill a tank in 20 hours and another tap can empty it in 25 hours. If both taps are opened together, how long will it take to fill the tank?",
        questionHindi: "16. एक नल किसी टंकी को 20 घंटे में भर सकता है और दूसरा नल उसे 25 घंटे में खाली कर सकता है। यदि दोनों एक साथ खोल दिए जाएं, तो टंकी कितने समय में भरेगी?",
        options: ["100 घंटे", "200 घंटे", "500 घंटे", "400 घंटे", "300 घंटे"],
        correctAnswer: "100 घंटे"
    },
    {
        questionEnglish: "17. If A can complete a work in 24 days and B can do the same work in 16 days, how many days will they take to complete the work together?",
        questionHindi: "17. यदि A अकेला किसी कार्य को 24 दिनों में और B अकेला उसी कार्य को 16 दिनों में पूरा करता है, तो दोनों मिलकर कितने दिनों में कार्य पूरा करेंगे?",
        options: ["9.6 दिन", "10.5 दिन", "12 दिन", "8 दिन", "6 दिन"],
        correctAnswer: "9.6 दिन"
    },
    {
        questionEnglish: "18. A and B can complete a work in 15 days. If A can do the same work in 25 days, how many days will B take to complete the work alone?",
        questionHindi: "18. A और B किसी कार्य को 15 दिनों में पूरा कर सकते हैं। यदि A अकेला कार्य को 25 दिनों में पूरा करता है, तो B अकेला कितने दिनों में कार्य पूरा करेगा?",
        options: ["40 दिन", "50 दिन", "30 दिन", "45 दिन", "35 दिन"],
        correctAnswer: "30 दिन"
    },
    {
        questionEnglish: "19. A can complete a work in 10 days and B can do the same work in 20 days. How many days will they take to complete the work together?",
        questionHindi: "19. A किसी कार्य को 10 दिनों में और B उसी कार्य को 20 दिनों में पूरा कर सकता है। दोनों मिलकर कितने दिनों में कार्य पूरा करेंगे?",
        options: ["6.66 दिन", "5 दिन", "7.5 दिन", "8 दिन", "4 दिन"],
        correctAnswer: "6.66 दिन"
    },
    {
        questionEnglish: "20. If 15 workers can complete a work in 45 days, how many days will 25 workers take to complete the same work?",
        questionHindi: "20. 15 मजदूर किसी कार्य को 45 दिनों में पूरा कर सकते हैं, तो 25 मजदूर वही कार्य कितने दिनों में पूरा करेंगे?",
        options: ["20 दिन", "30 दिन", "25 दिन", "18 दिन", "15 दिन"],
        correctAnswer: "27 दिन"
    },
    {
        questionEnglish: "21. If 8 persons can complete a work in 16 days, how many days will 4 persons take to complete the same work?",
        questionHindi: "21. यदि 8 व्यक्ति किसी कार्य को 16 दिनों में पूरा कर सकते हैं, तो 4 व्यक्ति उसी कार्य को कितने दिनों में पूरा करेंगे?",
        options: ["32 दिन", "24 दिन", "20 दिन", "18 दिन", "16 दिन"],
        correctAnswer: "32 दिन"
    },
    {
        questionEnglish: "22. If A can complete a work in 12 days and B can do the same work in 18 days, how many days will they take to complete the work together?",
        questionHindi: "22. यदि A किसी काम को 12 दिनों में और B उसी काम को 18 दिनों में पूरा कर सकता है, तो दोनों मिलकर काम कितने दिनों में पूरा करेंगे?",
        question: "15. एक आदमी अकेले किसी कार्य को 10 दिनों में करता है और दूसरा आदमी वही कार्य 15 दिनों में करता है। दोनों मिलकर कितने दिनों में कार्य पूरा करेंगे?",
        options: ["6 दिन", "7 दिन", "5 दिन", "8 दिन", "10 दिन"],
        correctAnswer: "6 दिन"
    },
    {
        questionEnglish: "23. A and B together can complete a work in 10 days. A alone can do the same work in 15 days. How many days will B take to complete the work alone?",
        questionHindi: "23. A और B मिलकर किसी कार्य को 10 दिनों में पूरा कर सकते हैं। A अकेला वही काम 15 दिनों में करता है। B अकेले वही काम कितने दिनों में करेगा?",
        options: ["30 दिन", "25 दिन", "20 दिन", "15 दिन", "10 दिन"],
        correctAnswer: "30 दिन"
    },
    {
        questionEnglish: "24. One tap can fill a tank in 8 hours, while another tap can empty the same tank in 12 hours. If both taps are opened together, how long will it take to fill the tank?",
        questionHindi: "24. एक नल किसी टंकी को 8 घंटे में भर सकता है, जबकि दूसरा नल उसी टंकी को 12 घंटे में खाली कर सकता है। यदि दोनों नल एक साथ खोले जाएं, तो टंकी कितने समय में भरेगी?",
        options: ["24 घंटे", "16 घंटे", "12 घंटे", "8 घंटे", "6 घंटे"],
        correctAnswer: "24 घंटे"
    },
    {
        questionEnglish: "25. If 10 workers can complete a work in 20 days, how many days will 5 workers take to complete the same work?",
        questionHindi: "25. यदि 10 मजदूर किसी काम को 20 दिनों में पूरा करते हैं, तो 5 मजदूर वही काम कितने दिनों में पूरा करेंगे?",
        options: ["40 दिन", "30 दिन", "25 दिन", "20 दिन", "15 दिन"],
        correctAnswer: "40 दिन"
    },
    {
        questionEnglish: "26. If A can complete a work in 6 days and B can do the same work in 12 days, how many days will they take to complete the work together?",
        questionHindi: "26. यदि A किसी काम को 6 दिनों में पूरा कर सकता है और B उसी काम को 12 दिनों में करता है, तो दोनों मिलकर कितने दिनों में कार्य पूरा करेंगे?",
        options: ["4 दिन", "5 दिन", "6 दिन", "3 दिन", "2 दिन"],
        correctAnswer: "4 दिन"
    },
    {
        questionEnglish: "27. If 20 workers can complete a work in 30 days, how many days will 10 workers take to complete the same work?",
        questionHindi: "27. यदि 20 मजदूर किसी कार्य को 30 दिनों में पूरा करते हैं, तो 10 मजदूर वही कार्य कितने दिनों में पूरा करेंगे?",
        options: ["60 दिन", "45 दिन", "40 दिन", "30 दिन", "20 दिन"],
        correctAnswer: "60 दिन"
    },
    {
        questionEnglish: "28. One tap can fill a tank in 15 hours, while another tap can empty the same tank in 20 hours. If both taps are opened together, how long will it take to fill the tank?",
        questionHindi: "28. एक नल किसी टंकी को 15 घंटे में भरता है, जबकि दूसरा नल उसी टंकी को 20 घंटे में खाली करता है। यदि दोनों एक साथ खोल दिए जाएं, तो टंकी कितने घंटे में भरेगी?",
        options: ["60 घंटे", "45 घंटे", "30 घंटे", "25 घंटे", "20 घंटे"],
        correctAnswer: "60 घंटे"
    },
    {
        questionEnglish: "29. One person can complete a work in 18 days and another person can complete the same work in 27 days. How many days will they take to complete the work together?",
        questionHindi: "29. एक व्यक्ति किसी कार्य को 18 दिनों में कर सकता है और दूसरा व्यक्ति उसी कार्य को 27 दिनों में पूरा कर सकता है। दोनों मिलकर कार्य कितने दिनों में पूरा करेंगे?",
        options: ["10 दिन", "12 दिन", "14 दिन", "8 दिन", "6 दिन"],
        correctAnswer: "10.8 दिन"
    },
    {
        questionEnglish: "30. If 5 workers can complete a work in 15 days, how many days will 10 workers take to complete the same work?",
        questionHindi: "30. यदि 5 मजदूर किसी कार्य को 15 दिनों में पूरा करते हैं, तो 10 मजदूर वही कार्य कितने दिनों में पूरा करेंगे?",
        options: ["7.5 दिन", "10 दिन", "12 दिन", "15 दिन", "20 दिन"],
        correctAnswer: "7.5 दिन"
    }
];
