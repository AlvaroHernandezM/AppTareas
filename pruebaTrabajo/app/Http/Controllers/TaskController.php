<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use App\User;
use Illuminate\Support\Facades\Log;
use Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::all()->toArray();
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //return $request->input();
        $user = ($this->userVerification($request));

        if (is_null($user)) { // Error con usuario
            return response()->json( ( $this->userValidation( $request->input() ) ) );


        }else {  // Todo bien con usuario
            try {
                $task = new Task([
                    'name' => $request->input('name'),
                    'description' => $request->input('description'),
                    'user_id' => $request->input('user_id'),
                ]);
                $task->save();
                return response()->json(['status' => true, 'correcto'], 200);
            } catch (\Exception $e) {
                Log::critical("No almaceno tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
                return response('Something bad', 500);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function userVerification(Request $request){

        if ($this->validation($request->input()) == 1){

            $user = User::find($request->user_id);

            if (is_null($user)) { // No existe
                $user = new User();
                $user->id = $request->user_id;
                $user->name = $request->user_name;
                $user->email = $request->user_email;
                $user->save();
            }
            return $user;

        }else{
            return null;
        }

    }

    public function validation($task){
        $rules = [
            'name' => 'required',
            'user_id' => 'required'
        ];
        $message = [
            'required' => 'Error al validar la tarea'
        ];
        $validator = Validator::make($task, $rules, $message);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return($errors);
        }
        else {
            return 1;
        }
    }
}
