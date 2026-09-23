import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * services
 */
import { getQuizForAttempt, submitQuizAttempt } from '../../utils/quizUtils'
import { AttemptQuiz, QuizResult } from '../../interfaces/quizzes.interfaces'
import { CheckIcon, CloseIcon } from '../../utils/iconsUtils'
import Spinner from '../../components/Spinner/Spinner'
import Sidebar from '../../components/Sidebar/Sidebar'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'

type Stage = 'loading' | 'intro' | 'progress' | 'submitting' | 'result' | 'error'

// function to fomrat time
const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

export const TakeQuiz = () => {

    const { globalData } = useGlobalDataContext();

    const { userAuth } = useUserAuthContext();
    const dark = !globalData.themeGlobal
    const { id } = useParams()
    const quizId = id;

    const [stage, setStage] = useState<Stage>('loading') // state
    const [quiz, setQuiz] = useState<AttemptQuiz | null>(null) // quiz info
    const [currentIndex, setCurrentIndex] = useState(0); // manage question id to show it
    const [answers, setAnswers] = useState<Record<string, string>>({}) // answers from user
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
    const [result, setResult] = useState<QuizResult | null>(null) // result

    // ref
    const startedAtRef = useRef<number | null>(null)

    // load quiz info 
    useEffect(() => {

        let cancelled = false

        const load = async () => {
            setStage('loading')
            try {
                const data = await getQuizForAttempt(quizId as string)
                console.log(data);

                if (cancelled) return
                setQuiz(data.quiz)
                setCurrentIndex(0)
                setAnswers({})
                setResult(null)
                setStage('intro')
            } catch {
                if (!cancelled) setStage('error')
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [quizId]);

    // calculate seconds
    useEffect(() => {
        if (stage !== 'progress' || secondsLeft === null) return
        if (secondsLeft <= 0) {
            handleSubmit() // there are not any seconds, then send info to backend
            return
        }
        const t = setTimeout(
            // secondsLeft change here, so the usseEffect execute again each second
            () => setSecondsLeft(
                (s) => (s !== null ? s - 1 : s)), 1000 // change time
        );

        return () => clearTimeout(t)

    }, [stage, secondsLeft]);

    // sort questions in case if arrive unsorted
    const sortedQuestions = useMemo(
        () => (
            quiz
                ? [...quiz.questions].sort((a, b) => a.order - b.order)
                : [])
        , [quiz]);

    // get questions sorted
    const currentQuestion = sortedQuestions[currentIndex];

    // var to count questions answered
    const answeredCount = Object.keys(answers).length;

    // boolean to valid if is the last question
    const isLast = currentIndex === sortedQuestions.length - 1;

    // send answers to backend
    const handleSubmit = async () => {

        // evit send quiz empty
        if (!quiz) return
        setStage('submitting')

        // get time
        const duration = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0
        try {

            // build answers
            const payload = {
                answers: sortedQuestions.map(
                    (q) => (
                        {
                            questionId: q._id,
                            selectedOptionId: answers[q._id] ?? null // get or set id of option that user selected
                        })
                ),
                duration,
            }

            // send data to bakend
            const res = await submitQuizAttempt(userAuth.userId as string, quiz._id, payload)

            // set response
            setResult(res)
            setStage('result')
        } catch {
            setStage('error')
        }
    }

    // start
    const startQuiz = () => {
        if (!quiz) return
        startedAtRef.current = Date.now()

        // set time
        setSecondsLeft(quiz.timeLimit ? quiz.timeLimit * 60 : null)
        setStage('progress') // change statge then change ui
    }


    const selectOption = (
        questionId: string,
        optionId: string
    ) => {

        // when seelct an option
        setAnswers((prev) => (
            {
                 ...prev, 
                [questionId]: optionId // add new id -> id: id
            }
        ));        
    }

    // progress questions
    const goNext = () => {
        if (isLast) {
            // send data to backend
            handleSubmit()
        } else {
            // progress the next question
            setCurrentIndex((i) => i + 1)
        }
    }

    // go back question
    const goBack = () => {
        setCurrentIndex((i) => Math.max(0, i - 1))
    }

    const retake = () => {
        setCurrentIndex(0)
        setAnswers({})
        setResult(null)
        setSecondsLeft(null)
        setStage('intro')
    }

    const cardClass = `rounded-2xl border ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`

    // ---- loading / error ----
    if (stage === 'loading') {
        return <Spinner />
    }
    if (stage === 'error' || !quiz) {
        return <div className="p-10 text-center text-sm text-rose-500">Something went wrong loading this quiz.</div>
    }

    return (
        <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            <Sidebar />
            <div className="max-w-5xl mx-auto h-screen px-4 sm:px-6 py-10 flex items-center justify-center">
                <AnimatePresence 
                    mode="wait"
                >
                    <div className="w-full">
                    {/*  intro  */}
                    {stage === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className={`${cardClass} p-8 text-center`}
                        >
                            {/* show quiz info */}
                            <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{quiz.title}</h1>
                            {quiz.description && <p className={`mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{quiz.description}</p>}

                            <div className="mt-5 flex items-center justify-center gap-6">
                                <div>
                                    <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{sortedQuestions.length}</p>
                                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Questions</p>
                                </div>
                                <div>
                                    <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{quiz.timeLimit ? `${quiz.timeLimit} min` : '—'}</p>
                                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Time limit</p>
                                </div>
                            </div>

                            <button
                                onClick={startQuiz}
                                className="mt-7 px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
                            >
                                Start quiz
                            </button>
                        </motion.div>
                    )}

                    {/* progress stage */}
                    {stage === 'progress' && currentQuestion && ( // currentQuestion valid if there is questions
                        <motion.div 
                            key="progress" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                        >
                            {/* progress bar + timer */}
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Question {currentIndex + 1} of {sortedQuestions.length}
                                </span>

                                {/* show seconds */}
                                {secondsLeft !== null && (
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${secondsLeft <= 30 ? 'bg-rose-50 text-rose-600' : dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {formatTime(secondsLeft)}
                                    </span>
                                )}
                            </div>

                            {/* progress bar */}
                            <div className={`h-1.5 rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <motion.div
                                    className="h-full bg-[#2563EB]"
                                    animate={{ width: `${((currentIndex + 1) / sortedQuestions.length) * 100}%` }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                /> 
                            </div>
                            
                            {/* question card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestion._id}
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                    className={`${cardClass} p-6 mt-4`}
                                >
                                    <p className={`text-base font-semibold leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{currentQuestion.question}</p>

                                    {/* show options */}
                                    <div className="mt-4 flex flex-col gap-2.5">
                                        {
                                            currentQuestion.options.map((option) => {

                                                // boolean to print diferent option selected
                                                const selected = answers[currentQuestion._id] === option._id

                                                return (
                                                    <button
                                                        key={option._id}
                                                        onClick={() => selectOption(currentQuestion._id, option._id)}
                                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${selected
                                                            ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                                                            : dark
                                                                ? 'border-gray-800 text-gray-200 hover:border-gray-700'
                                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`h-4 w-4 flex-shrink-0 rounded-full border-2 ${selected ? 'border-[#2563EB] bg-[#2563EB]' : dark ? 'border-gray-700' : 'border-gray-300'
                                                                }`}
                                                        />
                                                        {option.text}
                                                    </button>
                                                )
                                            }
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* dot navigator */}
                            <div className="flex items-center justify-center gap-1.5 mt-4">
                                {sortedQuestions.map((q, i) => (
                                    <button
                                        key={q._id}
                                        onClick={() => setCurrentIndex(i)}
                                        aria-label={`Go to question ${i + 1}`}
                                        className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-5 bg-[#2563EB]' : answers[q._id] ? 'w-2 bg-[#2563EB]/50' : `w-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* nav buttons */}
                            <div className="flex items-center justify-between mt-5">

                                {/* go back to last question */}
                                <button
                                    onClick={goBack}
                                    disabled={currentIndex === 0}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Back
                                </button>
                                <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {answeredCount}/{sortedQuestions.length} answered
                                </span>
                                {/* check go question or last */}
                                <button
                                    onClick={goNext}
                                    disabled={!answers[currentQuestion._id]}
                                    className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLast ? 'Submit quiz' : 'Next'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* stage submitting */}
                    {stage === 'submitting' && (
                        <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${cardClass} p-10 text-center`}>
                            <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Scoring your answers...</p>
                        </motion.div>
                    )}

                    {/* stage result  */}
                    {stage === 'result' && result && (
                        <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                            <div className={`${cardClass} p-8 text-center`}>
                                <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Your quiz was submitted</p>
                                <p className={`mt-1 text-3xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>{result.score}%</p>
                                <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {result.correctAnswers}/{result.totalQuestions} correct · {result.earnedPoints}/{result.totalPoints} points · {formatTime(result.duration)}
                                </p>

                                <button
                                    onClick={retake}
                                    className={`mt-5 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Retake quiz
                                </button>
                            </div>

                            <div className={`${cardClass} p-5 flex flex-col gap-3`}>
                                <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Answer review</p>
                                {result.breakdown.map((item) => (
                                    <div key={item.questionId} className={`rounded-xl border p-3 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{item.question}</p>
                                            <span
                                                className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${item.isCorrect ? 'bg-green-500' : 'bg-rose-500'
                                                    }`}
                                            >
                                                {item.isCorrect ? <CheckIcon size={12} /> : <CloseIcon />}
                                            </span>
                                        </div>
                                        <p className={`mt-1.5 text-xs ${item.isCorrect ? 'text-green-600' : 'text-rose-500'}`}>
                                            Your answer: {item.selectedOptionText ?? 'No answer'}
                                        </p>
                                        {!item.isCorrect && <p className="text-xs text-green-600">Correct answer: {item.correctOptionText}</p>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
</div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default TakeQuiz