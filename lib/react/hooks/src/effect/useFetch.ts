import type { DependencyList } from "react"
import { useAsync } from "."

const DEFAULT_OPTIONS = {
    headers: { "Content-Type": "application/json" }
}

const useFetch = <PromiseDataType, ErrorType = any>(
    url: string, 
    options: RequestInit | undefined = {}, 
    dependencies: DependencyList = []
) => useAsync<PromiseDataType, ErrorType>(
    () => fetch(url, {...DEFAULT_OPTIONS, ...options})
    .then(
        res => res.ok 
        ? res.json()
        // Fetch never fails by default so this makes sure it fails on error
        : res.json().then(json => Promise.reject(json))
    ), dependencies
)

export default useFetch
