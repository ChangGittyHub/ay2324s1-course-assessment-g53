import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { Button } from '@mui/material'
import LanguageSelection from './LanguageSelection'

function CodeExecutionComponent ({userCode}) {
  const [output, setOutput] = useState(null)
  const [runtimeVersions, setRuntimeVersions] = useState({
    c: '',
    csharp: '',
    cpp: '',
    go: '',
    haskell: '',
    java: '',
    javascript: '',
    python3: '',
  })
  const [curLang, setCurLang] = useState('python')

  useEffect(() => {
    // Fetch runtime versions from the API
    fetch('https://emkc.org/api/v2/piston/runtimes')
      .then((response) => response.json())
      .then((data) => {
        // Filter the data to get the versions of Python, Java, and C++
        const pythonVersion = data.find((runtime) => runtime.language === 'python')
        const javaVersion = data.find((runtime) => runtime.language === 'java')
        const cppVersion = data.find((runtime) => runtime.language === 'c++')
        const javascriptVersion = data.find((runtime) => runtime.language === 'javascript')
        const cVersion = data.find((runtime) => runtime.language === 'c')
        const csharpVersion = data.find((runtime) => runtime.language === 'csharp')
        const goVersion = data.find((runtime) => runtime.language === 'go')
        const haskellVersion = data.find((runtime) => runtime.language === 'haskell')

        // Update the state with the versions
        setRuntimeVersions({
          c: cVersion ? cVersion.version : '',
          csharp: csharpVersion ? csharpVersion.version : '',
          cpp: cppVersion ? cppVersion.version : '',
          go: goVersion ? goVersion.version : '',
          haskell: haskellVersion ? haskellVersion.version : '',
          java: javaVersion ? javaVersion.version : '',
          javascript: javascriptVersion ? javascriptVersion.version : '',
          python3: pythonVersion ? pythonVersion.version : '',
        })
      })
      .catch((error) => {
        console.error('Error fetching runtime versions: ', error)
      })
  }, [])

  // Event handler for selecting a different coding language
  const handleLanguageChange = (event) => {
    setCurLang(event.target.value)
  }

  // Event handler for the submit button
  const handleSubmit = async () => {
    const code = userCode
    console.log(code)
    const cleanedCode = code.replace(/[\u00A0]/g, '  ')

    // Create the payload to send to the API
    const payload = {
      language: curLang,
      version: runtimeVersions[curLang],
      files: [
        {
          name: 'my_cool_code.py',
          content: cleanedCode,
        },
      ],
      stdin: '',
      args: ['1', '2', '3'],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }

    // Make the POST request to the API
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Handle the response (you may want to do error checking here)
    const responseData = await response.json()
    setOutput(responseData)
  }

  return (
    <div>
      <LanguageSelection
        curLang={curLang}
        handleLanguageChange={handleLanguageChange}
        runtimeVersions={runtimeVersions}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</Button>
      {output && (
        <div>
          <h2>Code Submission result:</h2>
          <div style={{ width: "100%", height: "100%", overflowY: "scroll", border: "1px solid #ccc", padding: "10px", maxHeight: "300px", maxWidth: "800px" }}>
            {output?.run?.stderr ? (
              <div>
                <h2>Error Output:</h2>
                <pre>{output.run.stderr}</pre>
              </div>
            ) : (
              <div>
                <h2>Standard Output:</h2>
                <pre>{output?.run?.stdout}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    // <div>
    //   <h2>API Response:</h2>
    //   <div> {JSON.stringify(output)} </div>
    // </div>
  )
}

export default CodeExecutionComponent