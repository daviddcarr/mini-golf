import { getSuggestedQuery } from '@testing-library/react'
import create from 'zustand'

export const useGame = create((set) => {



    const gameState = [
        {
            hole: 1,
            par: 2,
            strokes: 0,
        },
        {
            hole: 2,
            par: 2,
            strokes: 0,
        },
        {
            hole: 3,
            par: 2,
            strokes: 0,
        },
        {
            hole: 4,
            par: 3,
            strokes: 0,
        },
        {
            hole: 5,
            par: 3,
            strokes: 0,
        },
        {
            hole: 6,
            par: 1,
            strokes: 0,
        },
        {
            hole: 7,
            par: 1,
            strokes: 0,
        },
        {
            hole: 8,
            par: 2,
            strokes: 0,
        },
        {
            hole: 9,
            par: 2,
            strokes: 0,
        },

    ]

    return {
        cameraMode: 'free',
        setCameraMode: (mode) => set({ cameraMode: mode }),
        toggleCameraMode: () => set((state) => ({ cameraMode: state.cameraMode === 'free' ? 'follow' : 'free' })),

        cameraPosition: [0.25, 0.25, 0],
        setCameraPosition: (position) => set({ cameraPosition: position }),

        isHidden: false,
        setIsHidden: (isHidden) => set({ isHidden: isHidden }),

        currentLevel: 1,
        setNextLevel: () => {
            setTimeout(() => {
                set((state) => ({ currentLevel: state.currentLevel + 1 }))
                set({ isHidden: false })
            }
            , 5000)
        },
        
        gameState: gameState,
        addStroke: () => {
            set((state) => {
                const newGameState = [...state.gameState]
                console.log("Game State", newGameState)
                newGameState[state.currentLevel-1].strokes++
                return { gameState: newGameState }
            })
        },
        getGameState: () => gameState
    }

})