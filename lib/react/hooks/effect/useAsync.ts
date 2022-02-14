import { useCallback, useEffect, useState } from "react"
import type { DependencyList } from "react"

const useAsync = <PromiseDataType, ErrorType = any>(
    callback: () => Promise<PromiseDataType>, 
    dependencies: DependencyList = []
) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<ErrorType>()
    const [data, setData] = useState<PromiseDataType>()
    
    const callbackMemoized = useCallback(() => {
        setLoading(true)
        setError(undefined)
        setData(undefined)

        callback()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false))

    }, dependencies)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return {loading, error, data}
}

export default useAsync
