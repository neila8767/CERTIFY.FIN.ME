/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./pages/PageAcceuil/AuthContext.js":
/*!******************************************!*\
  !*** ./pages/PageAcceuil/AuthContext.js ***!
  \******************************************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_2__]);\naxios__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// contexts/AuthContext.js\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst AuthProvider = ({ children })=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const [authState, setAuthState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        role: '',\n        formData: {\n            username: \"\",\n            password: \"\",\n            universityId: null,\n            name: \"\",\n            prenom: \"\",\n            phone: \"\",\n            email: \"\",\n            roleEcole: \"\"\n        },\n        universities: [],\n        selectedUniversity: null,\n        errors: {\n            password: \"\"\n        }\n    });\n    // Chargement des universités quand le rôle est UNIVERSITY\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"AuthProvider.useEffect\": ()=>{\n            if (authState.role === \"UNIVERSITY\") {\n                axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get(\"http://localhost:5000/universities-auth\").then({\n                    \"AuthProvider.useEffect\": (res)=>setAuthState({\n                            \"AuthProvider.useEffect\": (prev)=>({\n                                    ...prev,\n                                    universities: res.data\n                                })\n                        }[\"AuthProvider.useEffect\"])\n                }[\"AuthProvider.useEffect\"]).catch(console.error);\n            }\n        }\n    }[\"AuthProvider.useEffect\"], [\n        authState.role\n    ]);\n    const handleUniversitySelect = (e)=>{\n        const uniId = parseInt(e.target.value);\n        setAuthState((prev)=>({\n                ...prev,\n                selectedUniversity: uniId,\n                formData: {\n                    ...prev.formData,\n                    universityId: uniId\n                }\n            }));\n    };\n    const handleChange = (e)=>{\n        const { name, value } = e.target;\n        setAuthState((prev)=>({\n                ...prev,\n                formData: {\n                    ...prev.formData,\n                    [name]: value\n                },\n                errors: name === \"password\" ? validatePassword(value) : prev.errors\n            }));\n    };\n    const validatePassword = (value)=>{\n        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*~_\\-+=`|\\\\(){}[\\]:;\"'<>,.?/]).{8,12}$/;\n        if (!value) return {\n            password: \"Le mot de passe est requis\"\n        };\n        if (value.length > 12) return {\n            password: \"Maximum 12 caractères\"\n        };\n        if (value.length < 8) return {\n            password: \"Minimum 8 caractères\"\n        };\n        if (!passwordRegex.test(value)) return {\n            password: \"Doit contenir 1 chiffre, 1 majuscule, 1 minuscule et 1 caractère spécial\"\n        };\n        return {\n            password: \"\"\n        };\n    };\n    const handleSubmit = async (e)=>{\n        e.preventDefault();\n        if (authState.errors.password) {\n            console.error(\"Validation error:\", authState.errors.password);\n            return;\n        }\n        try {\n            const response = await axios__WEBPACK_IMPORTED_MODULE_2__[\"default\"].post(\"http://localhost:5000/register\", {\n                ...authState.formData,\n                role: authState.role\n            }, {\n                headers: {\n                    'Content-Type': 'application/json'\n                }\n            });\n            console.log(\"Registration successful:\", response.data);\n            router.push(\"/PageAcceuil/EmailVerification\");\n        } catch (err) {\n            console.error(\"Registration error details:\", {\n                message: err.message,\n                response: err.response?.data,\n                status: err.response?.status,\n                config: err.config\n            });\n            // Mettez à jour l'état avec le message d'erreur du serveur\n            setAuthState((prev)=>({\n                    ...prev,\n                    errors: {\n                        ...prev.errors,\n                        server: err.response?.data?.message || \"Erreur lors de l'inscription\"\n                    }\n                }));\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            ...authState,\n            setAuthState,\n            handleUniversitySelect,\n            handleChange,\n            handleSubmit,\n            setRole: (role)=>setAuthState((prev)=>({\n                        ...prev,\n                        role\n                    }))\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\DELL\\\\Desktop\\\\pfe\\\\CetifyMe.Meriem\\\\pages\\\\PageAcceuil\\\\AuthContext.js\",\n        lineNumber: 109,\n        columnNumber: 5\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!context) {\n        throw new Error('useAuth must be used within an AuthProvider');\n    }\n    return context;\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL1BhZ2VBY2NldWlsL0F1dGhDb250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDBCQUEwQjs7QUFDNkM7QUFDN0M7QUFDYztBQUV4QyxNQUFNTSw0QkFBY04sb0RBQWFBO0FBRTFCLE1BQU1PLGVBQWUsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDdkMsTUFBTUMsU0FBU0osc0RBQVNBO0lBQ3hCLE1BQU0sQ0FBQ0ssV0FBV0MsYUFBYSxHQUFHVCwrQ0FBUUEsQ0FBQztRQUN6Q1UsTUFBTTtRQUNOQyxVQUFVO1lBQ1JDLFVBQVU7WUFDVkMsVUFBVTtZQUNWQyxjQUFjO1lBQ2RDLE1BQU07WUFDTkMsUUFBUTtZQUNSQyxPQUFPO1lBQ1BDLE9BQU87WUFDUEMsV0FBVztRQUNiO1FBQ0FDLGNBQWMsRUFBRTtRQUNoQkMsb0JBQW9CO1FBQ3BCQyxRQUFRO1lBQUVULFVBQVU7UUFBRztJQUN6QjtJQUVBLDBEQUEwRDtJQUMxRFosZ0RBQVNBO2tDQUFDO1lBQ1IsSUFBSU8sVUFBVUUsSUFBSSxLQUFLLGNBQWM7Z0JBQ25DUixpREFBUyxDQUFDLDJDQUNQc0IsSUFBSTs4Q0FBQ0MsQ0FBQUEsTUFBT2hCO3NEQUFhaUIsQ0FBQUEsT0FBUztvQ0FDakMsR0FBR0EsSUFBSTtvQ0FDUE4sY0FBY0ssSUFBSUUsSUFBSTtnQ0FDeEI7OzZDQUNDQyxLQUFLLENBQUNDLFFBQVFDLEtBQUs7WUFDeEI7UUFDRjtpQ0FBRztRQUFDdEIsVUFBVUUsSUFBSTtLQUFDO0lBRW5CLE1BQU1xQix5QkFBeUIsQ0FBQ0M7UUFDOUIsTUFBTUMsUUFBUUMsU0FBU0YsRUFBRUcsTUFBTSxDQUFDQyxLQUFLO1FBQ3JDM0IsYUFBYWlCLENBQUFBLE9BQVM7Z0JBQ3BCLEdBQUdBLElBQUk7Z0JBQ1BMLG9CQUFvQlk7Z0JBQ3BCdEIsVUFBVTtvQkFBRSxHQUFHZSxLQUFLZixRQUFRO29CQUFFRyxjQUFjbUI7Z0JBQU07WUFDcEQ7SUFDRjtJQUVBLE1BQU1JLGVBQWUsQ0FBQ0w7UUFDcEIsTUFBTSxFQUFFakIsSUFBSSxFQUFFcUIsS0FBSyxFQUFFLEdBQUdKLEVBQUVHLE1BQU07UUFDaEMxQixhQUFhaUIsQ0FBQUEsT0FBUztnQkFDcEIsR0FBR0EsSUFBSTtnQkFDUGYsVUFBVTtvQkFBRSxHQUFHZSxLQUFLZixRQUFRO29CQUFFLENBQUNJLEtBQUssRUFBRXFCO2dCQUFNO2dCQUM1Q2QsUUFBUVAsU0FBUyxhQUFhdUIsaUJBQWlCRixTQUFTVixLQUFLSixNQUFNO1lBQ3JFO0lBQ0Y7SUFFQSxNQUFNZ0IsbUJBQW1CLENBQUNGO1FBQ3hCLE1BQU1HLGdCQUFnQjtRQUV0QixJQUFJLENBQUNILE9BQU8sT0FBTztZQUFFdkIsVUFBVTtRQUE2QjtRQUM1RCxJQUFJdUIsTUFBTUksTUFBTSxHQUFHLElBQUksT0FBTztZQUFFM0IsVUFBVTtRQUF3QjtRQUNsRSxJQUFJdUIsTUFBTUksTUFBTSxHQUFHLEdBQUcsT0FBTztZQUFFM0IsVUFBVTtRQUF1QjtRQUNoRSxJQUFJLENBQUMwQixjQUFjRSxJQUFJLENBQUNMLFFBQVEsT0FBTztZQUFFdkIsVUFBVTtRQUEyRTtRQUU5SCxPQUFPO1lBQUVBLFVBQVU7UUFBRztJQUN4QjtJQUVBLE1BQU02QixlQUFlLE9BQU9WO1FBQzFCQSxFQUFFVyxjQUFjO1FBRWhCLElBQUluQyxVQUFVYyxNQUFNLENBQUNULFFBQVEsRUFBRTtZQUM3QmdCLFFBQVFDLEtBQUssQ0FBQyxxQkFBcUJ0QixVQUFVYyxNQUFNLENBQUNULFFBQVE7WUFDNUQ7UUFDRjtRQUVBLElBQUk7WUFDRixNQUFNK0IsV0FBVyxNQUFNMUMsa0RBQVUsQ0FBQyxrQ0FBa0M7Z0JBQ2xFLEdBQUdNLFVBQVVHLFFBQVE7Z0JBQ3JCRCxNQUFNRixVQUFVRSxJQUFJO1lBQ3RCLEdBQUc7Z0JBQ0RvQyxTQUFTO29CQUNQLGdCQUFnQjtnQkFDbEI7WUFDRjtZQUVBakIsUUFBUWtCLEdBQUcsQ0FBQyw0QkFBNEJILFNBQVNqQixJQUFJO1lBQ3JEcEIsT0FBT3lDLElBQUksQ0FBQztRQUVkLEVBQUUsT0FBT0MsS0FBSztZQUNacEIsUUFBUUMsS0FBSyxDQUFDLCtCQUErQjtnQkFDM0NvQixTQUFTRCxJQUFJQyxPQUFPO2dCQUNwQk4sVUFBVUssSUFBSUwsUUFBUSxFQUFFakI7Z0JBQ3hCd0IsUUFBUUYsSUFBSUwsUUFBUSxFQUFFTztnQkFDdEJDLFFBQVFILElBQUlHLE1BQU07WUFDcEI7WUFFQSwyREFBMkQ7WUFDM0QzQyxhQUFhaUIsQ0FBQUEsT0FBUztvQkFDcEIsR0FBR0EsSUFBSTtvQkFDUEosUUFBUTt3QkFDTixHQUFHSSxLQUFLSixNQUFNO3dCQUNkK0IsUUFBUUosSUFBSUwsUUFBUSxFQUFFakIsTUFBTXVCLFdBQVc7b0JBQ3pDO2dCQUNGO1FBQ0Y7SUFDRjtJQUVBLHFCQUNFLDhEQUFDOUMsWUFBWWtELFFBQVE7UUFBQ2xCLE9BQU87WUFDM0IsR0FBRzVCLFNBQVM7WUFDWkM7WUFDQXNCO1lBQ0FNO1lBQ0FLO1lBQ0FhLFNBQVMsQ0FBQzdDLE9BQVNELGFBQWFpQixDQUFBQSxPQUFTO3dCQUFFLEdBQUdBLElBQUk7d0JBQUVoQjtvQkFBSztRQUMzRDtrQkFDR0o7Ozs7OztBQUdQLEVBQUU7QUFFSyxNQUFNa0QsVUFBVTtJQUNyQixNQUFNQyxVQUFVMUQsaURBQVVBLENBQUNLO0lBQzNCLElBQUksQ0FBQ3FELFNBQVM7UUFDWixNQUFNLElBQUlDLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNULEVBQUUiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcREVMTFxcRGVza3RvcFxccGZlXFxDZXRpZnlNZS5NZXJpZW1cXHBhZ2VzXFxQYWdlQWNjZXVpbFxcQXV0aENvbnRleHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gY29udGV4dHMvQXV0aENvbnRleHQuanNcclxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5cclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgY29uc3QgQXV0aFByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gIGNvbnN0IFthdXRoU3RhdGUsIHNldEF1dGhTdGF0ZV0gPSB1c2VTdGF0ZSh7XHJcbiAgICByb2xlOiAnJyxcclxuICAgIGZvcm1EYXRhOiB7XHJcbiAgICAgIHVzZXJuYW1lOiBcIlwiLFxyXG4gICAgICBwYXNzd29yZDogXCJcIixcclxuICAgICAgdW5pdmVyc2l0eUlkOiBudWxsLFxyXG4gICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICBwcmVub206IFwiXCIsXHJcbiAgICAgIHBob25lOiBcIlwiLFxyXG4gICAgICBlbWFpbDogXCJcIixcclxuICAgICAgcm9sZUVjb2xlOiBcIlwiLFxyXG4gICAgfSxcclxuICAgIHVuaXZlcnNpdGllczogW10sXHJcbiAgICBzZWxlY3RlZFVuaXZlcnNpdHk6IG51bGwsXHJcbiAgICBlcnJvcnM6IHsgcGFzc3dvcmQ6IFwiXCIgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBDaGFyZ2VtZW50IGRlcyB1bml2ZXJzaXTDqXMgcXVhbmQgbGUgcsO0bGUgZXN0IFVOSVZFUlNJVFlcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGF1dGhTdGF0ZS5yb2xlID09PSBcIlVOSVZFUlNJVFlcIikge1xyXG4gICAgICBheGlvcy5nZXQoXCJodHRwOi8vbG9jYWxob3N0OjUwMDAvdW5pdmVyc2l0aWVzLWF1dGhcIilcclxuICAgICAgICAudGhlbihyZXMgPT4gc2V0QXV0aFN0YXRlKHByZXYgPT4gKHtcclxuICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICB1bml2ZXJzaXRpZXM6IHJlcy5kYXRhXHJcbiAgICAgICAgfSkpKVxyXG4gICAgICAgIC5jYXRjaChjb25zb2xlLmVycm9yKTtcclxuICAgIH1cclxuICB9LCBbYXV0aFN0YXRlLnJvbGVdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVW5pdmVyc2l0eVNlbGVjdCA9IChlKSA9PiB7XHJcbiAgICBjb25zdCB1bmlJZCA9IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKTtcclxuICAgIHNldEF1dGhTdGF0ZShwcmV2ID0+ICh7XHJcbiAgICAgIC4uLnByZXYsXHJcbiAgICAgIHNlbGVjdGVkVW5pdmVyc2l0eTogdW5pSWQsXHJcbiAgICAgIGZvcm1EYXRhOiB7IC4uLnByZXYuZm9ybURhdGEsIHVuaXZlcnNpdHlJZDogdW5pSWQgfVxyXG4gICAgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcclxuICAgIHNldEF1dGhTdGF0ZShwcmV2ID0+ICh7XHJcbiAgICAgIC4uLnByZXYsXHJcbiAgICAgIGZvcm1EYXRhOiB7IC4uLnByZXYuZm9ybURhdGEsIFtuYW1lXTogdmFsdWUgfSxcclxuICAgICAgZXJyb3JzOiBuYW1lID09PSBcInBhc3N3b3JkXCIgPyB2YWxpZGF0ZVBhc3N3b3JkKHZhbHVlKSA6IHByZXYuZXJyb3JzXHJcbiAgICB9KSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdmFsaWRhdGVQYXNzd29yZCA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipbMC05XSkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbIUAjJCVeJip+X1xcLSs9YHxcXFxcKCl7fVtcXF06O1wiJzw+LC4/L10pLns4LDEyfSQvO1xyXG4gICAgXHJcbiAgICBpZiAoIXZhbHVlKSByZXR1cm4geyBwYXNzd29yZDogXCJMZSBtb3QgZGUgcGFzc2UgZXN0IHJlcXVpc1wiIH07XHJcbiAgICBpZiAodmFsdWUubGVuZ3RoID4gMTIpIHJldHVybiB7IHBhc3N3b3JkOiBcIk1heGltdW0gMTIgY2FyYWN0w6hyZXNcIiB9O1xyXG4gICAgaWYgKHZhbHVlLmxlbmd0aCA8IDgpIHJldHVybiB7IHBhc3N3b3JkOiBcIk1pbmltdW0gOCBjYXJhY3TDqHJlc1wiIH07XHJcbiAgICBpZiAoIXBhc3N3b3JkUmVnZXgudGVzdCh2YWx1ZSkpIHJldHVybiB7IHBhc3N3b3JkOiBcIkRvaXQgY29udGVuaXIgMSBjaGlmZnJlLCAxIG1hanVzY3VsZSwgMSBtaW51c2N1bGUgZXQgMSBjYXJhY3TDqHJlIHNww6ljaWFsXCIgfTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHsgcGFzc3dvcmQ6IFwiXCIgfTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgXHJcbiAgICBpZiAoYXV0aFN0YXRlLmVycm9ycy5wYXNzd29yZCkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiVmFsaWRhdGlvbiBlcnJvcjpcIiwgYXV0aFN0YXRlLmVycm9ycy5wYXNzd29yZCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICBcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZWdpc3RlclwiLCB7XHJcbiAgICAgICAgLi4uYXV0aFN0YXRlLmZvcm1EYXRhLFxyXG4gICAgICAgIHJvbGU6IGF1dGhTdGF0ZS5yb2xlXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWw6XCIsIHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICByb3V0ZXIucHVzaChcIi9QYWdlQWNjZXVpbC9FbWFpbFZlcmlmaWNhdGlvblwiKTtcclxuICAgICAgXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcIlJlZ2lzdHJhdGlvbiBlcnJvciBkZXRhaWxzOlwiLCB7XHJcbiAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXHJcbiAgICAgICAgcmVzcG9uc2U6IGVyci5yZXNwb25zZT8uZGF0YSxcclxuICAgICAgICBzdGF0dXM6IGVyci5yZXNwb25zZT8uc3RhdHVzLFxyXG4gICAgICAgIGNvbmZpZzogZXJyLmNvbmZpZ1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vIE1ldHRleiDDoCBqb3VyIGwnw6l0YXQgYXZlYyBsZSBtZXNzYWdlIGQnZXJyZXVyIGR1IHNlcnZldXJcclxuICAgICAgc2V0QXV0aFN0YXRlKHByZXYgPT4gKHtcclxuICAgICAgICAuLi5wcmV2LFxyXG4gICAgICAgIGVycm9yczoge1xyXG4gICAgICAgICAgLi4ucHJldi5lcnJvcnMsXHJcbiAgICAgICAgICBzZXJ2ZXI6IGVyci5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCBcIkVycmV1ciBsb3JzIGRlIGwnaW5zY3JpcHRpb25cIlxyXG4gICAgICAgIH1cclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3tcclxuICAgICAgLi4uYXV0aFN0YXRlLFxyXG4gICAgICBzZXRBdXRoU3RhdGUsXHJcbiAgICAgIGhhbmRsZVVuaXZlcnNpdHlTZWxlY3QsXHJcbiAgICAgIGhhbmRsZUNoYW5nZSxcclxuICAgICAgaGFuZGxlU3VibWl0LFxyXG4gICAgICBzZXRSb2xlOiAocm9sZSkgPT4gc2V0QXV0aFN0YXRlKHByZXYgPT4gKHsgLi4ucHJldiwgcm9sZSB9KSlcclxuICAgIH19PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGggbXVzdCBiZSB1c2VkIHdpdGhpbiBhbiBBdXRoUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn07Il0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJheGlvcyIsInVzZVJvdXRlciIsIkF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJyb3V0ZXIiLCJhdXRoU3RhdGUiLCJzZXRBdXRoU3RhdGUiLCJyb2xlIiwiZm9ybURhdGEiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwidW5pdmVyc2l0eUlkIiwibmFtZSIsInByZW5vbSIsInBob25lIiwiZW1haWwiLCJyb2xlRWNvbGUiLCJ1bml2ZXJzaXRpZXMiLCJzZWxlY3RlZFVuaXZlcnNpdHkiLCJlcnJvcnMiLCJnZXQiLCJ0aGVuIiwicmVzIiwicHJldiIsImRhdGEiLCJjYXRjaCIsImNvbnNvbGUiLCJlcnJvciIsImhhbmRsZVVuaXZlcnNpdHlTZWxlY3QiLCJlIiwidW5pSWQiLCJwYXJzZUludCIsInRhcmdldCIsInZhbHVlIiwiaGFuZGxlQ2hhbmdlIiwidmFsaWRhdGVQYXNzd29yZCIsInBhc3N3b3JkUmVnZXgiLCJsZW5ndGgiLCJ0ZXN0IiwiaGFuZGxlU3VibWl0IiwicHJldmVudERlZmF1bHQiLCJyZXNwb25zZSIsInBvc3QiLCJoZWFkZXJzIiwibG9nIiwicHVzaCIsImVyciIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJjb25maWciLCJzZXJ2ZXIiLCJQcm92aWRlciIsInNldFJvbGUiLCJ1c2VBdXRoIiwiY29udGV4dCIsIkVycm9yIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/PageAcceuil/AuthContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var _styles_App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/App.css */ \"(pages-dir-node)/./styles/App.css\");\n/* harmony import */ var _styles_Header_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/Header.css */ \"(pages-dir-node)/./styles/Header.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _PageAcceuil_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PageAcceuil/AuthContext */ \"(pages-dir-node)/./pages/PageAcceuil/AuthContext.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/head */ \"(pages-dir-node)/./node_modules/next/head.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_PageAcceuil_AuthContext__WEBPACK_IMPORTED_MODULE_4__]);\n_PageAcceuil_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n // 👉 Ajouté ici\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_PageAcceuil_AuthContext__WEBPACK_IMPORTED_MODULE_4__.AuthProvider, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\DELL\\\\Desktop\\\\pfe\\\\CetifyMe.Meriem\\\\pages\\\\_app.js\",\n                lineNumber: 15,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\DELL\\\\Desktop\\\\pfe\\\\CetifyMe.Meriem\\\\pages\\\\_app.js\",\n            lineNumber: 14,\n            columnNumber: 7\n        }, this)\n    }, void 0, false);\n}\n// Si vous surchargez getInitialProps dans _app.js\nMyApp.getInitialProps = async (appContext)=>{\n    let pageProps = {};\n    if (appContext.Component.getInitialProps) {\n        pageProps = await appContext.Component.getInitialProps(appContext.ctx);\n    }\n    return {\n        pageProps\n    };\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBMkI7QUFDRztBQUNDO0FBRzBCO0FBQzVCLENBQUMsZ0JBQWdCO0FBRTlDLFNBQVNFLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckMscUJBQ0U7a0JBR0UsNEVBQUNKLGtFQUFZQTtzQkFDWCw0RUFBQ0c7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7O0FBSWhDO0FBRUEsa0RBQWtEO0FBQ2xERixNQUFNRyxlQUFlLEdBQUcsT0FBT0M7SUFDN0IsSUFBSUYsWUFBWSxDQUFDO0lBQ2pCLElBQUlFLFdBQVdILFNBQVMsQ0FBQ0UsZUFBZSxFQUFFO1FBQ3hDRCxZQUFZLE1BQU1FLFdBQVdILFNBQVMsQ0FBQ0UsZUFBZSxDQUFDQyxXQUFXQyxHQUFHO0lBQ3ZFO0lBQ0EsT0FBTztRQUFFSDtJQUFVO0FBQ3JCO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcREVMTFxcRGVza3RvcFxccGZlXFxDZXRpZnlNZS5NZXJpZW1cXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL0FwcC5jc3MnO1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9IZWFkZXIuY3NzJztcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5cclxuXHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4vUGFnZUFjY2V1aWwvQXV0aENvbnRleHQnO1xyXG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnOyAvLyDwn5GJIEFqb3V0w6kgaWNpXHJcblxyXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuXHJcblxyXG4gICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgICA8Lz5cclxuICApO1xyXG59XHJcblxyXG4vLyBTaSB2b3VzIHN1cmNoYXJnZXogZ2V0SW5pdGlhbFByb3BzIGRhbnMgX2FwcC5qc1xyXG5NeUFwcC5nZXRJbml0aWFsUHJvcHMgPSBhc3luYyAoYXBwQ29udGV4dCkgPT4ge1xyXG4gIGxldCBwYWdlUHJvcHMgPSB7fTtcclxuICBpZiAoYXBwQ29udGV4dC5Db21wb25lbnQuZ2V0SW5pdGlhbFByb3BzKSB7XHJcbiAgICBwYWdlUHJvcHMgPSBhd2FpdCBhcHBDb250ZXh0LkNvbXBvbmVudC5nZXRJbml0aWFsUHJvcHMoYXBwQ29udGV4dC5jdHgpO1xyXG4gIH1cclxuICByZXR1cm4geyBwYWdlUHJvcHMgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE15QXBwO1xyXG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiSGVhZCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiZ2V0SW5pdGlhbFByb3BzIiwiYXBwQ29udGV4dCIsImN0eCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/App.css":
/*!************************!*\
  !*** ./styles/App.css ***!
  \************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./styles/Header.css":
/*!***************************!*\
  !*** ./styles/Header.css ***!
  \***************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.js")));
module.exports = __webpack_exports__;

})();