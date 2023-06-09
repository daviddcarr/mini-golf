import create from 'zustand'

export const useGame = create((set) => {


    return {
        cameraMode: 'free',
        setCameraMode: (mode) => set({ cameraMode: mode }),
        toggleCameraMode: () => set((state) => ({ cameraMode: state.cameraMode === 'free' ? 'follow' : 'free' })),

        strokeCount: 0,
        addStroke: () => set((state) => ({ strokeCount: state.strokeCount + 1 })),
    }

})