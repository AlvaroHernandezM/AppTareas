<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            //$table->increments('id');
            $table->bigInteger('id',false, true);
            $table->string('name', 120);
            $table->string('email',100)->unique();
            $table->string('password')->nullable();
            //$table->bigInteger('token_facebook')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->primary('id');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
